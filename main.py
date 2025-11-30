import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI()

# -----------------------------
#  CORS (allow frontend calls)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
#  Load API Key
# -----------------------------
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise Exception("Missing: GOOGLE_GEMINI_API_KEY environment variable")

genai.configure(api_key=GEMINI_API_KEY)

# -----------------------------
#   Models
# -----------------------------
class IngredientsRequest(BaseModel):
    ingredients: list[str]

class GenerateInstructionsRequest(BaseModel):
    recipe_id: str
    recipe_name: str
    ingredients: list[str]

# -----------------------------
#   Load Recipes Helper
# -----------------------------
def load_recipes():
    try:
        with open("recipes.json", "r") as f:
            return json.load(f)
    except:
        raise HTTPException(status_code=500, detail="Could not load recipes.json")

def save_recipes(data):
    with open("recipes.json", "w") as f:
        json.dump(data, f, indent=2)

# -----------------------------
#   Get All Ingredients
# -----------------------------
@app.get("/api/ingredients")
async def get_ingredients():
    data = load_recipes()
    ingredients = sorted({i for r in data["recipes"] for i in r["ingredients"]})
    return {"ingredients": list(ingredients)}

# -----------------------------
#   Find Matching Recipes
# -----------------------------
@app.post("/api/recipes/match")
async def match_recipes(req: IngredientsRequest):
    data = load_recipes()
    given = set(i.lower() for i in req.ingredients)

    matches = []
    for r in data["recipes"]:
        recipe_ingredients = set(i.lower() for i in r["ingredients"])

        has = list(recipe_ingredients & given)
        missing = list(recipe_ingredients - given)

        match_pct = int((len(has) / len(recipe_ingredients)) * 100)

        matches.append({
            "id": r.get("id"),
            "name": r.get("name"),
            "title": r.get("name"),
            "note": r.get("note"),
            "ingredients": r["ingredients"],
            "hasIngredients": has,
            "missingIngredients": missing,
            "matchPercentage": match_pct,
            "instructions": r.get("instructions", [])
        })

    matches.sort(key=lambda x: x["matchPercentage"], reverse=True)
    return {"matches": matches}

# -----------------------------
#   Auto-Generate Instructions
# -----------------------------
@app.post("/api/generate-instructions")
async def generate_instructions(request: GenerateInstructionsRequest):
    data = load_recipes()

    recipe = next((r for r in data["recipes"] if r["id"] == request.recipe_id), None)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
Generate detailed, beginner-friendly step-by-step instructions for the recipe "{request.recipe_name}".

Use these ingredients: {', '.join(request.ingredients)}

Output ONLY a clean numbered list of steps.
Each step must be a full sentence.
"""

    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        steps = [
            line.strip()
            for line in raw_text.split("\n")
            if line.strip() and not line.startswith("#")
        ]

        recipe["instructions"] = steps
        save_recipes(data)

        return {"instructions": steps}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



