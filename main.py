# main.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import json
import uuid
import math
from collections import Counter
#for fuzzy search
import re
import difflib

# ------------------------
# PATHS
# ------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
RECIPES_PATH = os.path.join(DATA_DIR, "recipes.json")
INGREDIENTS_PATH = os.path.join(DATA_DIR, "ingredients.json")

# ------------------------
# FASTAPI APP
# ------------------------
app = FastAPI(title="SmartChef (Light TF-IDF Backend)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# SMALL UTILITIES
# ------------------------
_nonword_re = re.compile(r"[^\w\s]")  # remove punctuation , relapse with space 

def normalize_token(s: str) -> str:
    if not s:
        return ""
    s2 = s.lower().strip()
    s2 = _nonword_re.sub(" ", s2)
    s2 = " ".join(s2.split()) #multiple sapce -> single space
    return s2
    
#cheks for read path , gives error if nor found
def read_json_file(path: str) -> Any:
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
        
#cheks for write  path , gives error if nor found 
#write path to input emtry string into json file if "id", "instructions" or "title" are missing 
def write_json_file(path: str, data: Any):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ------------------------
# LOAD DATA
# ------------------------
def load_ingredients() -> List[str]:
    if not os.path.exists(INGREDIENTS_PATH):
        return []
    data = read_json_file(INGREDIENTS_PATH)
    #to support multiple formats of jason data
    if isinstance(data, dict):
        items = data.get("ingredients", [])
    elif isinstance(data, list):
        items = data
    else:
        raise HTTPException(status_code=500, detail="ingredients.json unsupported format")
    return [str(x) for x in items] #makes sure "ingredients" are strings
    
def load_recipes(normalize_and_save: bool = False) -> List[Dict[str, Any]]:
    if not os.path.exists(RECIPES_PATH):
        return []
    raw = read_json_file(RECIPES_PATH)
    raw_is_dict = isinstance(raw, dict) #to chek if jason file is raw
    recipes = raw.get("recipes", []) if raw_is_dict else raw

    changed = False
    for r in recipes:
        #generates new UUID id if not existing
        if "id" not in r or not r.get("id"):
            r["id"] = str(uuid.uuid4())
            changed = True
        #makes emtry list of "ingredients" dont exist or converts "ingredients" to a list 
        if "ingredients" not in r or not isinstance(r["ingredients"], list):
            r["ingredients"] = r.get("ingredients", []) or []
            changed = True
        #same as before but with "instructions"
        if "instructions" not in r or not isinstance(r["instructions"], list):
            r["instructions"] = r.get("instructions", []) or []
            changed = True
        #same as before but with "title"
        if "name" in r and "title" not in r:
            r["title"] = r["name"]
            changed = True

        # calls normalize token funtion to normalize them
        r["_norm_ingredients"] = [normalize_token(x) for x in r.get("ingredients", []) if isinstance(x, str)]
        
    #if new data is added , it is saved into json databse
    if normalize_and_save and changed:
        if raw_is_dict:
            raw["recipes"] = recipes
            write_json_file(RECIPES_PATH, raw)
        else:
            write_json_file(RECIPES_PATH, {"recipes": recipes})

    return recipes

# ------------------------
# GLOBAL DATA + INDEX
# ------------------------
INGREDIENTS = []
RECIPES = []
DOC_COUNT = 0
IDF: Dict[str, float] = {} #creating a dictionary IDF with keys as str datatype and float values 
RECIPE_TFIDF: Dict[str, Dict[str, float]] = {} #dictionary for recipe ID and it's ingredients's IDF values 
RECIPE_NORM: Dict[str, float] = {} #dictionary to store final nromalized IDF vector of each recipe

def build_tfidf_index(recipes: List[Dict[str, Any]]):#loads in previously tokenized ingredients list for recipes database
    global DOC_COUNT, IDF, RECIPE_TFIDF, RECIPE_NORM
    DOC_COUNT = max(1, len(recipes))

    # calculating document frequency
    df = Counter()
    for r in recipes:
        tokens = set(r.get("_norm_ingredients", [])) #set to eliminate repairing ingredients
        for t in tokens:
            df[t] += 1

    # IDF calculation 
    IDF = {}
    for term, cnt in df.items():
        IDF[term] = math.log((DOC_COUNT + 1) / (cnt + 1)) + 1.0
        
    #if unknown term , cnt=0
    default_idf = math.log((DOC_COUNT + 1) / 1) + 1.0

    # creating a tf-idf vector for each recipe
    RECIPE_TFIDF = {}
    RECIPE_NORM = {}
    for r in recipes:
        rid = r["id"]
        tokens = r.get("_norm_ingredients", [])
        tf = Counter(tokens)
        vec = {}
        for term, tf_count in tf.items():
            idf = IDF.get(term, default_idf)
            vec[term] = tf_count * idf
        RECIPE_TFIDF[rid] = vec
        RECIPE_NORM[rid] = math.sqrt(sum(v * v for v in vec.values())) if vec else 0.0 #normalized for cosine similarity and stored in the dict with recipe id 
        
    # store into globals
    globals()["IDF"] = IDF
    globals()["RECIPE_TFIDF"] = RECIPE_TFIDF
    globals()["RECIPE_NORM"] = RECIPE_NORM

# Initialize data at startup
try:
    INGREDIENTS = load_ingredients()
except Exception:
    INGREDIENTS = []

try:
    RECIPES = load_recipes(normalize_and_save=False)
    build_tfidf_index(RECIPES)
except Exception:
    RECIPES = []

# ------------------------
# MODELS
# ------------------------
class MatchRequest(BaseModel):
    ingredients: List[str]

# ------------------------
# QUERY VECTOR + SIM
# ------------------------
def map_user_tokens_with_fuzzy(user_items: List[str], available_terms: List[str], cutoff: float = 0.75) -> List[str]:
    """
    Maping user's typed ingredients to normalized tokens.
    Uses difflib.get_close_matches to fix typos 
    If there is a close match in available_terms, use that. Otherwise use the normalized raw token.
    """
    mapped = []
    available_set = set(available_terms)
    for it in user_items:
        norm = normalize_token(it) #normalizeing the users query
        if not norm:
            continue
        if norm in available_set:
            mapped.append(norm) #cheking if entered already exists in database
            continue
        # try fuzzy matches (first on available ingredient tokens)
        close = difflib.get_close_matches(norm, list(available_terms), n=1, cutoff=cutoff)
        if close:
            mapped.append(close[0])
        else:
            # keep the normalized token (it will get default IDF)
            mapped.append(norm)
    return mapped

def build_query_vector(user_items: List[str]) -> Dict[str, float]:
    tokens = [t for t in user_items if t]
    tf = Counter(tokens)
    default_idf = math.log((DOC_COUNT + 1) / 1) + 1.0
    vec = {}
    for term, count in tf.items():
        idf = IDF.get(term, default_idf)
        vec[term] = count * idf
    return vec

#calcualting the cosine similarity between the users queried ingredients and all recipes in the database
def cosine_similarity(vec1: Dict[str, float], vec1_norm: Optional[float], vec2: Dict[str, float], vec2_norm: Optional[float]) -> float:
    if not vec1 or not vec2:
        return 0.0
    dot = 0.0
    for k, v in vec1.items():
        if k in vec2:
            dot += v * vec2[k]
            
    #normlaizes vectors if not done previously
    if vec1_norm is None or vec1_norm == 0.0:
        vec1_norm = math.sqrt(sum(v * v for v in vec1.values())) 
    if vec2_norm is None or vec2_norm == 0.0:
        vec2_norm = math.sqrt(sum(v * v for v in vec2.values()))
    if vec1_norm == 0.0 or vec2_norm == 0.0:
        return 0.0
    return dot / (vec1_norm * vec2_norm)

# ------------------------
# API ROUTES
# ------------------------

#Returns API status + number of recipes
@app.get("/")
async def root():
    return {"status": "SmartChef backend (light TF-IDF) running", "recipes_count": len(RECIPES)}

# returns raw ingredients file
@app.get("/api/ingredients")
async def api_ingredients():
    return {"ingredients": INGREDIENTS}

#Returns recipes 
@app.get("/api/recipes")
async def api_list_recipes():
    out = []
    for r in RECIPES:
        rr = {k: v for k, v in r.items() if not k.startswith("_")}
        out.append(rr)
    return {"recipes": out}

@app.post("/api/recipes/match")
async def api_match(req: MatchRequest, sort: str = Query("tfidf"), top_k: Optional[int] = Query(None)):
    """
    Returns data.matches = [ { id, title, ingredients, hasIngredients, missingIngredients, matchPercentage, relevanceScore } ]
    relevanceScore = TF-IDF cosine similarity scaled to 0-100 (int)
    matchPercentage = simple (#have / #recipe_total) * 100 (int)
    
    """

    # validate & normalize user entered list
    raw_items = [str(x) for x in (req.ingredients or []) if isinstance(x, (str,)) and x.strip()]
    if not raw_items:
        return {"matches": []}

    # prepare available terms list (all tokens we know from recipes + optional ingredients list)
    known_terms = set()
    for r in RECIPES:
        known_terms.update(r.get("_norm_ingredients", []))
    # also include ingredients.json normalized
    known_terms.update([normalize_token(x) for x in INGREDIENTS if isinstance(x, str)])

    # map user tokens with fuzzy matching
    user_mapped = map_user_tokens_with_fuzzy(raw_items, list(known_terms), cutoff=0.7)

    # build query vector
    qvec = build_query_vector(user_mapped)
    qnorm = math.sqrt(sum(v * v for v in qvec.values())) if qvec else 0.0

    #skip recipes with no ingredients
    results = []
    for r in RECIPES:
        orig_ings = r.get("ingredients", [])
        norm_ings = r.get("_norm_ingredients", [])
        total = len(norm_ings)
        if total == 0:
            continue

        # build ingredients they have and ingredients they are missing list, then return original ingredient strings back to frontend
        has_list = [orig for orig, norm in zip(orig_ings, norm_ings) if norm in user_mapped]
        missing_list = [orig for orig, norm in zip(orig_ings, norm_ings) if norm not in user_mapped]
        
        #calulate match percentage
        match_pct = int((len(has_list) / total) * 100) if total > 0 else 0

        # calculate relevance score
        recipe_vec = RECIPE_TFIDF.get(r["id"], {})
        recipe_norm = RECIPE_NORM.get(r["id"], 0.0)
        sim = cosine_similarity(qvec, qnorm, recipe_vec, recipe_norm)
        relevance_score = int(sim * 100)

        # keep results if non-zero similarity OR at least one matched ingredient
        if relevance_score > 0 or len(has_list) > 0:
            results.append({
                "id": r["id"],
                "title": r.get("title") or r.get("name"),
                "ingredients": orig_ings,
                "instructions": r.get("instructions", []),
                "hasIngredients": has_list,
                "missingIngredients": missing_list,
                "matchPercentage": match_pct,
                "relevanceScore": relevance_score
            })

    # sorting to put the best match on top
    if sort == "match":
        results.sort(key=lambda x: x["matchPercentage"], reverse=True)
    else:
        results.sort(key=lambda x: (x["relevanceScore"], x["matchPercentage"]), reverse=True)

    if top_k is not None and isinstance(top_k, int) and top_k > 0:
        results = results[:top_k]

    return {"matches": results}

@app.post("/api/recompute-index")
async def api_recompute_index():
    global RECIPES, INGREDIENTS
    RECIPES = load_recipes(normalize_and_save=False)
    INGREDIENTS = load_ingredients()
    build_tfidf_index(RECIPES)
    return {"status": "ok", "recipes": len(RECIPES)}

