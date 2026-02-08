# SmartChef — TF-IDF Embeding Backend

FastAPI is used as backend for ingredient-based recipe matching using TF-IDF vectors, fuzzy mapping, and cosine similarity.

Backend Server is hosted separately :
https://smartchef-backend-oq3n.onrender.com/

## To Run Locally-
1. Add your datasets:  
   - `data/recipes.json`  
   - `data/ingredients.json`
2. Install dependencies:
pip install -r requirements.txt
3. Start server:
**Local host your own server for the backend endpoints.**
uvicorn main:app --reload --host 0.0.0.0 --port 8000

## Backend API Endpoints  
- **GET /api/ingredients** — Ingredient list  
- **GET /api/recipes** — Recipe metadata  
- **POST /api/recipes/match** — Ingredient match + similarity scores  
- **POST /api/recompute-index** — Rebuild TF-IDF index  


## Requirements
-fastapi>=0.95
-uvicorn[standard]>=0.22
-pydantic>=1.10

## Application Startup Flow

1. FastAPI server initializes.
2. `ingredients.json` is loaded into **RAM**.
3. `recipes.json` is loaded and validated:
   - Missing IDs are generated.
   - Ingredients and instructions are enforced as lists.
   - Normalized ingredient tokens are created.
4. A TF-IDF index is built:
   - Document Frequency (DF)
   - Inverse Document Frequency (IDF)
   - Per-recipe TF-IDF vectors
   - Vectors are normalized for cosine similarity
5. The API is ready to serve requests.


## String Normalization

All ingredient strings are normalized to ensure consistent matching:
- Converted to lowercase
- Punctuation and special characters removed
- Leading and trailing spaces trimmed
- Multiple spaces collapsed into one


## TF-IDF Indexing

### Definitions

- Each recipe is treated as a document.
- Each ingredient in the recipe is treated as a term.

### Document Frequency (DF)

Counts number of recipes containg a given ingredient.

### Inverse Document Frequency (IDF)
      IDF(term) = log((N + 1) / (df + 1)) + 1
- `N` = total number of recipes
- `df` = number of recipes containing the term

### Term Frequency (TF)

Counts how often an ingredient appears in a recipe.

### TF-IDF Vector
         TF-IDF = TF × IDF

---

## Conclusion

The SmartChef backend demonstrates practical application of TF-IDF–based similarity search using `ingredient <--> recipe matching`. It's simple, fast, and reliable.
---
