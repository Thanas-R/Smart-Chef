# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import uuid
import math
import traceback

# ------------------------
# PATHS (look for data/ first, otherwise root)
# ------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

# prefer files in data/ but fall back to root
RECIPES_PATH = os.path.join(DATA_DIR, "recipes.json")
if not os.path.exists(RECIPES_PATH):
    RECIPES_PATH = os.path.join(BASE_DIR, "recipes.json")

INGREDIENTS_PATH = os.path.join(DATA_DIR, "ingredients.json")
if not os.path.exists(INGREDIENTS_PATH):
    INGREDIENTS_PATH = os.path.join(BASE_DIR, "ingredients.json")

# ------------------------
# FASTAPI APP
# ------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# UTIL: file read/write
# ------------------------
def read_json_file(path):
    if not os.path.exists(path):
        # return None rather than raise so endpoints can decide
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading {path}: {str(e)}")

def write_json_file(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ------------------------
# LOAD / NORMALIZE INGREDIENTS
# ------------------------
def load_ingredients():
    data = read_json_file(INGREDIENTS_PATH)
    if data is None:
        # no file found -> return empty list (frontend will handle)
        print(f"[WARN] ingredients file not found at {INGREDIENTS_PATH}")
        return []
    # Accept both ["tomato",...] and {"ingredients": [...]} formats
    if isinstance(data, dict):
        return data.get("ingredients", [])
    if isinstance(data, list):
        return data
    raise HTTPException(status_code=500, detail="ingredients.json format unsupported")

# ------------------------
# LOAD / NORMALIZE RECIPES
# ------------------------
def load_recipes(normalize_and_save=True):
    raw = read_json_file(RECIPES_PATH)
    if raw is None:
        # if missing, return empty list
        print(f"[WARN] recipes file not found at {RECIPES_PATH}")
        return []

    changed = False
    if isinstance(raw, dict):
        recipes = raw.get("recipes", [])
    elif isinstance(raw, list):
        recipes = raw
    else:
        raise HTTPException(status_code=500, detail="recipes.json has unsupported top-level type")

    # normalize each recipe
    for r in recipes:
        if not isinstance(r, dict):
            raise HTTPException(status_code=500, detail="Each recipe must be an object/dict")
        if "id" not in r or not r.get("id"):
            r["id"] = str(uuid.uuid4())
            changed = True
        if "title" not in r and "name" in r:
            r["title"] = r.get("name")
            changed = True
        if "ingredients" not in r or not isinstance(r.get("ingredients"), list):
            r["ingredients"] = r.get("ingredients", []) if isinstance(r.get("ingredients", list), list) else []
            changed = True
        if "instructions" not in r or not isinstance(r.get("instructions"), list):
            r["instructions"] = r.get("instructions", []) if isinstance(r.get("instructions"), list) else []
            changed = True

    if changed and normalize_and_save:
        # write back with consistent shape {"recipes": [...]} to avoid ambiguity later
        write_json_file(RECIPES_PATH, {"recipes": recipes})

    return recipes

# ------------------------
# LIGHTWEIGHT EMBEDDING: bag-of-words freq (pure Python)
# ------------------------
def text_to_vector(text: str):
    if not text:
        return {}
    # simple tokenization: remove commas, split on whitespace
    words = text.lower().replace(",", " ").replace(".", " ").split()
    vec = {}
    for w in words:
        vec[w] = vec.get(w, 0) + 1
    return vec

def cosine_similarity(vec1: dict, vec2: dict):
    # dot product
    dot = 0.0
    for k, v in vec1.items():
        if k in vec2:
            dot += v * vec2[k]
    # magnitudes
    mag1 = math.sqrt(sum(v * v for v in vec1.values()))
    mag2 = math.sqrt(sum(v * v for v in vec2.values()))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot / (mag1 * mag2)

# ------------------------
# preload recipes + compute vectors
# ------------------------
try:
    RECIPES = load_recipes(normalize_and_save=False)
except Exception:
    print("[ERROR] failed to load recipes on startup:")
    traceback.print_exc()
    RECIPES = []

# compute ingredient-text and vector per recipe
for r in RECIPES:
    ing_text = " ".join([str(i) for i in r.get("ingredients", [])])
    r["_ingredient_text"] = ing_text
    try:
        r["_vec"] = text_to_vector(ing_text)
    except Exception:
        r["_vec"] = {}

print(f"[INFO] Loaded {len(RECIPES)} recipes. Ingredients file: {INGREDIENTS_PATH}")

# ------------------------
# Pydantic models
# ------------------------
class MatchRequest(BaseModel):
    ingredients: list[str]

# ------------------------
# API Endpoints
# ------------------------
@app.get("/")
async def root():
    return {"status": "SmartChef backend running"}

@app.get("/api/ingredients")
async def api_ingredients():
    try:
        ingredients = load_ingredients()
        return {"ingredients": ingredients}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recipes")
async def api_list_recipes():
    # return recipes but remove internal helpers
    safe = []
    for r in load_recipes(normalize_and_save=False):
        copy = dict(r)
        copy.pop("_vec", None)
        copy.pop("_ingredient_text", None)
        safe.append(copy)
    return {"recipes": safe}

@app.post("/api/recipes/match")
async def api_match(req: MatchRequest):
    try:
        recipes = RECIPES  # preloaded list
        # normalize user ingredients
        user_items = [str(i).lower().strip() for i in req.ingredients if isinstance(i, str) and i.strip()]
        user_text = " ".join(user_items)
        user_vec = text_to_vector(user_text)

        results = []
        user_set = set(user_items)

        for r in recipes:
            recipe_ing_raw = r.get("ingredients", [])
            # original displayed ingredients (preserve original strings)
            recipe_ing_clean = [str(x).strip() for x in recipe_ing_raw if isinstance(x, str)]
            recipe_ing_lower = [x.lower().strip() for x in recipe_ing_clean]

            # has = actual items user has (matching by exact token match on ingredient entries)
            has = [orig for orig, low in zip(recipe_ing_clean, recipe_ing_lower) if low in user_set]
            missing = [orig for orig, low in zip(recipe_ing_clean, recipe_ing_lower) if low not in user_set]

            # vector similarity (fallback to measure similarity even when no exact matches)
            vec_score = 0.0
            try:
                vec_score = cosine_similarity(user_vec, r.get("_vec", {}))
            except Exception:
                vec_score = 0.0

            # compute percentage: prefer exact-match fraction, but also scale with vector score a bit
            exact_pct = int((len(has) / max(1, len(recipe_ing_lower))) * 100)
            # composite score (keeps percentages in 0-100)
            composite_pct = max(exact_pct, int(vec_score * 100))

            # include only relevant recipes (if user provided items)
            include = False
            if len(user_set) == 0:
                include = True  # if user didn't provide, maybe list everything (frontend may prevent this)
            else:
                # include if at least one exact ingredient or vector similarity threshold
                if len(has) > 0 or vec_score > 0.20:
                    include = True

            if include:
                results.append({
                    "id": r.get("id"),
                    "title": r.get("title") or r.get("name"),
                    "name": r.get("name"),
                    "note": r.get("note", ""),
                    "ingredients": recipe_ing_clean,
                    "instructions": r.get("instructions", []),
                    "hasIngredients": has,
                    "missingIngredients": missing,
                    "matchPercentage": composite_pct,
                    "matchedCount": len(has),
                    "totalIngredients": len(recipe_ing_lower)
                })

        # sort by matchPercentage desc, then by matchedCount
        results.sort(key=lambda x: (x["matchPercentage"], x["matchedCount"]), reverse=True)
        return {"matches": results}

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
