# main.py
import os
import json
import uuid
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# SWITCH: Set environment variable USE_TFIDF=1 to use TF-IDF, otherwise Sentence-Transformers is used.
USE_TFIDF = os.getenv("USE_TFIDF", "") == "1"

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
RECIPES_PATH = os.path.join(DATA_DIR, "recipes.json")
INGREDIENTS_PATH = os.path.join(DATA_DIR, "ingredients.json")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- file helpers ----------
def read_json_file(path):
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail=f"Missing JSON file: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json_file(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ---------- load / normalize recipes ----------
def load_recipes(normalize_and_save=True):
    raw = read_json_file(RECIPES_PATH)
    recipes = raw.get("recipes", raw) if isinstance(raw, dict) else raw
    changed = False
    for r in recipes:
        if "id" not in r:
            r["id"] = str(uuid.uuid4())
            changed = True
        if "title" not in r and "name" in r:
            r["title"] = r["name"]
            changed = True
        r.setdefault("ingredients", [])
        r.setdefault("instructions", [])
    if changed and normalize_and_save:
        write_json_file(RECIPES_PATH, {"recipes": recipes})
    return recipes

def load_ingredients():
    data = read_json_file(INGREDIENTS_PATH)
    if isinstance(data, dict):
        return data.get("ingredients", [])
    if isinstance(data, list):
        return data
    raise HTTPException(status_code=500, detail="Invalid ingredients.json format")

# ---------- API models ----------
class MatchRequest(BaseModel):
    ingredients: List[str]

# ---------- Backend: either TF-IDF or SentenceTransformers ----------
if USE_TFIDF:
    # Lightweight TF-IDF setup
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    print("Using TF-IDF vectorizer (lightweight).")
    RECIPES = load_recipes(normalize_and_save=False)

    documents = []
    for r in RECIPES:
        parts = [
            r.get("title", ""),
            " ".join(r.get("ingredients", [])),
            " ".join(r.get("instructions", [])) if isinstance(r.get("instructions", []), list) else r.get("instructions", "")
        ]
        documents.append(" ".join(parts).lower())

    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform(documents)
    TFIDF_THRESHOLD = float(os.getenv("TFIDF_THRESHOLD", 0.18))

else:
    # Semantic embeddings setup (sentence-transformers)
    from sentence_transformers import SentenceTransformer, util
    import torch

    print("Loading SentenceTransformer 'all-MiniLM-L6-v2' (semantic).")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    embedder = SentenceTransformer("all-MiniLM-L6-v2", device=device)

    RECIPES = load_recipes(normalize_and_save=False)

    # Precompute embeddings in memory (as torch tensors)
    for r in RECIPES:
        ing_text = " ".join(r.get("ingredients", [])).lower()
        r["embedding"] = embedder.encode(ing_text, convert_to_tensor=True, device=device)
    EMB_THRESHOLD = float(os.getenv("EMB_THRESHOLD", 0.25))
    print("Recipe embeddings ready ✔")

# ---------- endpoints ----------
@app.get("/api/ingredients")
async def api_ingredients():
    return {"ingredients": load_ingredients()}

@app.post("/api/recipes/match")
async def api_match(req: MatchRequest):
    user_ingredients = [i for i in req.ingredients if i and i.strip()]
    user_query = " ".join([i.lower().strip() for i in user_ingredients])
    if not user_query:
        return {"matches": []}

    results = []

    if USE_TFIDF:
        query_vec = vectorizer.transform([user_query])
        similarity = cosine_similarity(query_vec, vectors).flatten()
        for i, score in enumerate(similarity):
            if score > TFIDF_THRESHOLD:
                r = RECIPES[i]
                results.append({
                    "id": r.get("id"),
                    "title": r.get("title"),
                    "name": r.get("name"),
                    "note": r.get("note", ""),
                    "ingredients": r.get("ingredients", []),
                    "instructions": r.get("instructions", []),
                    "matchPercentage": int(score * 100)
                })
    else:
        query_vec = embedder.encode(user_query, convert_to_tensor=True, device=device)
        for r in RECIPES:
            # r["embedding"] is a tensor
            score = util.cos_sim(query_vec, r["embedding"]).item()
            if score > EMB_THRESHOLD:
                results.append({
                    "id": r.get("id"),
                    "title": r.get("title"),
                    "name": r.get("name"),
                    "note": r.get("note", ""),
                    "ingredients": r.get("ingredients", []),
                    "instructions": r.get("instructions", []),
                    "matchPercentage": int(score * 100)
                })

    results.sort(key=lambda x: x["matchPercentage"], reverse=True)
    return {"matches": results}

@app.get("/api/recipes")
async def api_list_recipes():
    return {"recipes": load_recipes(normalize_and_save=False)}

@app.get("/")
async def root():
    mode = "TF-IDF" if USE_TFIDF else "Sentence-Transformer"
    return {"status": f"SmartChef Vector Backend Running ({mode}) 🎉"}

# Optional: simple recipe fetch by id (string)
@app.get("/api/recipe/{recipe_id}")
async def get_recipe(recipe_id: str):
    for r in RECIPES:
        if str(r.get("id")) == str(recipe_id):
            # remove in-memory tensor before returning if embedding present
            r_copy = r.copy()
            if "embedding" in r_copy:
                r_copy.pop("embedding", None)
            return r_copy
    raise HTTPException(status_code=404, detail="Recipe not found")
