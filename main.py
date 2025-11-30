from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import uuid
import os

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, later restrict to Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Load & Normalize Recipes ----

def normalize_recipe(r):
    """Convert your simple recipe format into full standard format."""
    return {
        "id": r.get("id") or str(uuid.uuid4()),
        "title": r.get("name", "Untitled Recipe"),
        "note": r.get("note", ""),
        "ingredients": r.get("ingredients", []),
        "instructions": r.get("instructions", ["No instructions provided."]),
        "prepTime": r.get("prepTime", 10),
        "cookTime": r.get("cookTime", 10),
        "difficulty": r.get("difficulty", "Easy"),
        "cuisine": r.get("cuisine", "")
    }

def load_recipes():
    path = os.path.join(os.path.dirname(__file__), "recipes.json")
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return [normalize_recipe(r) for r in raw]

recipes = load_recipes()


# ---- Ingredient Matching Helper ----

def match_recipe(user_ingredients, recipe):
    recipe_ingredients = [i.lower() for i in recipe["ingredients"]]
    user_ingredients = [i.lower() for i in user_ingredients]

    matched = [i for i in recipe_ingredients if i in user_ingredients]
    missing = [i for i in recipe_ingredients if i not in user_ingredients]

    match_pct = int((len(matched) / len(recipe_ingredients)) * 100)

    return {
        "id": recipe["id"],
        "title": recipe["title"],
        "note": recipe["note"],
        "ingredients": recipe["ingredients"],
        "matchedIngredients": matched,
        "missingIngredients": missing,
        "matchPercentage": match_pct
    }


# ---- API ROUTES ----

@app.get("/")
def home():
    return {"message": "SmartChef Backend Running"}

@app.post("/match")
def match_recipes(data: dict):
    user_ingredients = data.get("ingredients", [])

    results = [
        match_recipe(user_ingredients, r)
        for r in recipes
    ]

    results.sort(key=lambda x: x["matchPercentage"], reverse=True)
    return results

