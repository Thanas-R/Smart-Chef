from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import uuid
import math

# ------------------------
# PATHS
# ------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECIPES_PATH = os.path.join(BASE_DIR, "recipes.json")

# ------------------------
# FASTAPI APP
# ------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# LOAD RECIPES
# ------------------------
def load_recipes():
    if not os.path.exists(RECIPES_PATH):
        return []

    with open(RECIPES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Handle both list + { "recipes": [...] }
    if isinstance(data, dict):
        data = data.get("recipes", [])

    # Normalize IDs + fields
    for r in data:
        if "id" not in r:
            r["id"] = str(uuid.uuid4())
        if "ingredients" not in r:
            r["ingredients"] = []
        if "instructions" not in r:
            r["instructions"] = []
        if "name" in r and "title" not in r:
            r["title"] = r["name"]

    return data


RECIPES = load_recipes()

# ------------------------------------------------------------
# SIMPLE VECTOR EMBEDDING (PURE PYTHON — NO TORCH, NO SKLEARN)
# ------------------------------------------------------------

def text_to_vector(text: str):
    """
    Very lightweight vectorizer:
    Convert text → bag-of-words frequency dict.
    Example output:
    {"egg": 2, "milk": 1, "salt": 1}
    """
    words = text.lower().replace(",", " ").split()
    vec = {}
    for w in words:
        vec[w] = vec.get(w, 0) + 1
    return vec


def cosine_similarity(vec1: dict, vec2: dict):
    """
    Compute cosine similarity between bag-of-words vectors.
    """
    # dot product
    dot = 0
    for w in vec1:
        if w in vec2:
            dot += vec1[w] * vec2[w]

    # magnitudes
    mag1 = math.sqrt(sum(v * v for v in vec1.values()))
    mag2 = math.sqrt(sum(v * v for v in vec2.values()))

    if mag1 == 0 or mag2 == 0:
        return 0.0

    return dot / (mag1 * mag2)


# Precompute recipe vectors
for r in RECIPES:
    ingredient_text = " ".join(r["ingredients"])
    r["vec"] = text_to_vector(ingredient_text)


# ------------------------
# MODELS
# ------------------------
class MatchRequest(BaseModel):
    ingredients: list[str]


# ------------------------
# API ROUTES
# ------------------------
@app.get("/")
def root():
    return {"status": "SmartChef backend running"}


@app.get("/api/recipes")
def list_recipes():
    return {"recipes": RECIPES}


@app.post("/api/recipes/match")
def match_recipes(req: MatchRequest):

    user_ingredients = " ".join([i.lower().strip() for i in req.ingredients])
    if not user_ingredients:
        return {"matches": []}

    user_vec = text_to_vector(user_ingredients)

    results = []

    for r in RECIPES:
        score = cosine_similarity(user_vec, r["vec"])

        if score > 0.05:  # threshold for relevance
            results.append({
                "id": r["id"],
                "title": r.get("title"),
                "name": r.get("title"),
                "note": r.get("note", ""),
                "ingredients": r.get("ingredients", []),
                "instructions": r.get("instructions", []),
                "matchPercentage": int(score * 100)
            })

    # Sort highest match first
    results.sort(key=lambda x: x["matchPercentage"], reverse=True)

    return {"matches": results}
