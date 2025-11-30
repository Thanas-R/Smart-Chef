from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import uuid
import google.generativeai as genai

# --- PATHS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
RECIPES_PATH = os.path.join(DATA_DIR, "recipes.json")
INGREDIENTS_PATH = os.path.join(DATA_DIR, "ingredients.json")

# --- Configure Gemini (expects env var GOOGLE_GEMINI_API_KEY) ---
GEMINI_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
# If no key provided, generate-instructions endpoint will return 500 with a clear message.

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your Vercel domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Helpers -----------------
def read_json_file(path):
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail=f"File missing: {path}")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading {path}: {str(e)}")

def write_json_file(path, data):
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving {path}: {str(e)}")

def load_ingredients():
    data = read_json_file(INGREDIENTS_PATH)
    # accept both formats: ["tomato", ...]  OR  {"ingredients": ["tomato", ...]}
    if isinstance(data, dict):
        return data.get("ingredients", [])
    if isinstance(data, list):
        return data
    raise HTTPException(status_code=500, detail="ingredients.json has an unsupported format")

def load_recipes(normalize_and_save=True):
    """
    Accept either:
      - { "recipes": [ ... ] }
      - [ ... ]  (top-level list)
    Normalize each recipe (id/title) and optionally save back if changes made.
    Returns: list of recipe dicts
    """
    raw = read_json_file(RECIPES_PATH)
    changed = False

    if isinstance(raw, dict):
        recipes = raw.get("recipes", [])
    elif isinstance(raw, list):
        recipes = raw
        # we'll save back wrapped if normalizing (below)
    else:
        raise HTTPException(status_code=500, detail="recipes.json has an unsupported format")

    # normalize each recipe (ensure id, title fields)
    for r in recipes:
        # ensure dict
        if not isinstance(r, dict):
            raise HTTPException(status_code=500, detail="Each recipe must be an object/dict")
        if "id" not in r or not r.get("id"):
            r["id"] = str(uuid.uuid4())
            changed = True
        if "name" in r and "title" not in r:
            r["title"] = r.get("name")
            changed = True
        # ensure ingredients list exists
        if "ingredients" not in r or not isinstance(r["ingredients"], list):
            r["ingredients"] = r.get("ingredients", [])
            changed = True
        # ensure instructions exists (list)
        if "instructions" not in r or not isinstance(r["instructions"], list):
            r["instructions"] = r.get("instructions", []) if r.get("instructions") else []

    # If normalize_and_save and changes made, write back in a safe way:
    if normalize_and_save and changed:
        # prefer preserving original shape: if raw was dict, write back dict with 'recipes'
        if isinstance(raw, dict):
            raw["recipes"] = recipes
            write_json_file(RECIPES_PATH, raw)
        else:
            # raw was a top-level list: write back as {"recipes": [...]}
            write_json_file(RECIPES_PATH, {"recipes": recipes})

    return recipes

# ----------------- API Models -----------------
class MatchRequest(BaseModel):
    ingredients: list[str]

class GenerateInstructionsRequest(BaseModel):
    recipe_id: str | None = None
    recipe_name: str | None = None
    ingredients: list[str]

# ----------------- Endpoints -----------------
@app.get("/api/ingredients")
async def api_ingredients():
    ingredients = load_ingredients()
    return {"ingredients": ingredients}

@app.post("/api/recipes/match")
async def api_match(req: MatchRequest):
    recipes = load_recipes(normalize_and_save=False)
    user_set = set(i.lower().strip() for i in req.ingredients if isinstance(i, str))

    results = []
    for r in recipes:
        recipe_ing = [i.lower().strip() for i in r.get("ingredients", []) if isinstance(i, str)]
        has = [orig for orig in r.get("ingredients", []) if isinstance(orig, str) and orig.lower().strip() in user_set]
        missing = [orig for orig in r.get("ingredients", []) if isinstance(orig, str) and orig.lower().strip() not in user_set]
        pct = int((len(has) / max(1, len(recipe_ing))) * 100)
        results.append({
            "id": r.get("id"),
            "title": r.get("title") or r.get("name"),
            "name": r.get("name"),
            "note": r.get("note", ""),
            "ingredients": r.get("ingredients", []),
            "instructions": r.get("instructions", []),
            "hasIngredients": has,
            "missingIngredients": missing,
            "matchPercentage": pct
        })

    results.sort(key=lambda x: x["matchPercentage"], reverse=True)
    return {"matches": results}

@app.post("/api/generate-instructions")
async def api_generate(req: GenerateInstructionsRequest):
    # quick validation
    if not GEMINI_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured on server (GOOGLE_GEMINI_API_KEY missing)")

    recipes = load_recipes(normalize_and_save=True)  # allow saving ids if needed

    # find recipe by id first, then by name (case-insensitive)
    recipe = None
    if req.recipe_id:
        recipe = next((r for r in recipes if str(r.get("id")) == str(req.recipe_id)), None)
    if not recipe and req.recipe_name:
        name_lower = req.recipe_name.strip().lower()
        recipe = next((r for r in recipes if (r.get("name","").strip().lower() == name_lower) or (r.get("title","").strip().lower() == name_lower)), None)

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found by id or name")

    # build prompt
    prompt = f"""Generate clear, step-by-step cooking instructions for the recipe named "{recipe.get('name') or recipe.get('title')}".
Use these ingredients: {', '.join(req.ingredients if req.ingredients else recipe.get('ingredients', []))}.
Return ONLY a numbered list of steps, each step as a full sentence.
"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()
        # parse lines into steps (ignore any leading "1." etc.)
        steps = []
        for line in text.splitlines():
            line = line.strip()
            if not line: 
                continue
            # remove numbering like "1. " or "- " etc
            parts = line.split(".", 1)
            if parts[0].isdigit() and len(parts) > 1:
                step = parts[1].strip()
            else:
                # remove leading numbering with parenthesis or dash
                step = line.lstrip("-").lstrip().lstrip("•").strip()
            if step:
                steps.append(step)

        if not steps:
            raise HTTPException(status_code=500, detail="Gemini returned no usable instructions")

        # save into recipes.json
        recipe["instructions"] = steps
        # write back full file as {"recipes": [...]} to preserve consistent shape
        write_json_file(RECIPES_PATH, {"recipes": recipes})

        return {"instructions": steps}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating instructions: {str(e)}")

# Optional: a simple health root and recipe listing for debugging
@app.get("/")
async def root():
    return {"status": "SmartChef backend running"}

@app.get("/api/recipes")
async def api_list_recipes():
    recipes = load_recipes(normalize_and_save=False)
    return {"recipes": recipes}
