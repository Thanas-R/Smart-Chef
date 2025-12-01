from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import uuid
from sentence_transformers import SentenceTransformer, util
import torch

# -------------------------------
# PATHS
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
RECIPES_PATH = os.path.join(DATA_DIR, "recipes.json")
INGREDIENTS_PATH = os.path.join(DATA_DIR, "ingredients.json")

# -------------------------------
# FASTAPI APP
# -------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# LOAD LOCAL EMBEDDING MODEL
# -------------------------------
print("Loading MiniLM model…")
embedder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# -------------------------------
# FILE HELPERS
# -------------------------------
def read_json_file(path):
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail=f"Missing JSON file: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json_file(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# -------------------------------
# LOAD INGREDIENTS
# -------------------------------
def load_ingredients():
    data = read_json_file(INGREDIENTS_PATH)
    if isinstance(data, dict):
        return data.get("ingredients", [])
    if isinstance(data, list):
        return data
    raise HTTPException(status_code=500, detail="Invalid ingredients.json format")

# -------------------------------
# LOAD + NORMALIZE RECIPES
# -------------------------------
def load_recipes(normalize_and_save=True):
    raw = read_json_file(RECIPES_PATH)
    changed = False

    recipes = raw.get("recipes", raw) if isinstance(raw, dict) else raw

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

# -------------------------------
# API MODELS
# -------------------------------
class MatchRequest(BaseModel):
    ingredients: list[str]

# -------------------------------
# PRECOMPUTE RECIPE EMBEDDINGS
# -------------------------------
print("Loading + embedding recipes…")
RECIPES = load_recipes(normalize_and_save=False)

for r in RECIPES:
    ing_text = " ".join(r["ingredients"]).lower()
    r["embedding"] = embedder.encode(ing_text, convert_to_tensor=True)

print("Recipe embeddings ready ✔")

# -------------------------------
# ENDPOINTS
# -------------------------------
@app.get("/api/ingredients")
async def api_ingredients():
    return {"ingredients": load_ingredients()}

@app.post("/api/recipes/match")
async def api_match(req: MatchRequest):
    user_query = " ".join([i.lower().strip() for i in req.ingredients])
    if not user_query:
        return {"matches": []}

    # encode user query
    query_vec = embedder.encode(user_query, convert_to_tensor=True)

    results = []
    for r in RECIPES:
        score = util.cos_sim(query_vec, r["embedding"]).item()

        if score > 0.25:  # relevance threshold
            results.append({
                "id": r["id"],
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
    return {"status": "SmartChef Vector Backend Running 🎉"}
