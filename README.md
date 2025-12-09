# 🍳 SmartChef — TF-IDF Backend

FastAPI backend for ingredient-based recipe matching using TF-IDF vectors, fuzzy mapping, and cosine similarity.

## 🚀 Live Backend
https://smartchef-backend-oq3n.onrender.com/

## 📦 Run Locally
1. Add your datasets:  
   - `data/recipes.json`  
   - `data/ingredients.json`
2. Install dependencies:
pip install -r requirements.txt
3. Start server:
uvicorn main:app --reload --host 0.0.0.0 --port 8000

## 🔌 API Endpoints
- **GET /** — Health + recipe count  
- **GET /api/ingredients** — Ingredient list  
- **GET /api/recipes** — Recipe metadata  
- **POST /api/recipes/match** — Ingredient match + similarity scores  
- **POST /api/recompute-index** — Rebuild TF-IDF index  

## ☁️ Deployment
Works on Render / Railway / any Python host.  
Use:
uvicorn main:app --host 0.0.0.0 --port $PORT

## 📁 Requirements
fastapi>=0.95
uvicorn[standard]>=0.22
pydantic>=1.10
