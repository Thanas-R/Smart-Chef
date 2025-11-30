from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json
from utils import calculate_matches

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("data/recipes.json") as f:
    RECIPES = json.load(f)

ALL_INGREDIENTS = sorted({i for r in RECIPES for i in r["ingredients"]})

class MatchRequest(BaseModel):
    ingredients: List[str]

@app.get("/api/ingredients")
def get_ingredients():
    return {"ingredients": ALL_INGREDIENTS}

@app.post("/api/recipes/match")
def match_recipes(request: MatchRequest):
    matches = calculate_matches(request.ingredients, RECIPES)
    return {"matches": matches}
