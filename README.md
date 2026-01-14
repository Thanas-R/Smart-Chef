ch# SmartChef — Full Stack Recipe Matching System

SmartChef is a full-stack web application that provides intelligent recipe matching based on user-provided ingredients.  
It combines a lightweight frontend with a FastAPI backend that uses TF-IDF vectors, fuzzy search mapping to ingredients , and cosine similarity to suggest recipes and generate cooking steps using AI.

> **Demo:** https://smart-chef-pesu.vercel.app/ [might take 4-5 minutes to start working completetly]

## Overview

The SmartChef system allows users to:
- Enter available ingredients
- Discover matching recipes based on similarity
- See matched and missing ingredients
- Receive AI-generated cooking instructions

The frontend communicates directly with the backend REST API to fetch recipes, ingredient data, similarity scores, and generated cooking steps.


## Architecture

```

User Input
↓
Frontend (HTML + CSS + JS)
↓  Fetch API
Backend (FastAPI + TF-IDF + Cosine Similarity)
↓
Recipe Matches + AI Cooking Instructions

```


## Features

### Frontend
- Simple and responsive UI
- Ingredient-based recipe search
- Displays similarity scores
- Shows matched and missing ingredients
- Renders AI-generated cooking steps
- Lightweight and fast (no framework overhead)

### Backend
- Ingredient-based recipe matching using TF-IDF
- Fuzzy ingredient normalization
- Cosine similarity scoring
- JSON-based dataset support
- Production-ready FastAPI server

###  Search Architecture
This design follows the **Vector Space Model (VSM)**

This project implements a **information retrieval system** using an
**in-memory TF-IDF vector space model**, instead of relying on external databases
or pretrained embedding models.

Each recipe is converted into a **sparse TF-IDF vector**, where ingredient
importance is directly encoded as vector values. These vectors are stored
entirely in RAM and compared using **cosine similarity**, allowing fast
similarity calculations without using secondary memory.



## Tech Stack

### Frontend
| Layer | Technology |
|-----|-----------|
| UI | HTML, CSS |
| Logic | JavaScript |
| API Calls | Fetch API |

### Backend
| Layer | Technology |
|------|-----------|
| Framework | FastAPI |
| Vectorization | TF-IDF |
| Similarity | Cosine Similarity |
| AI | Google Gemini 2.5 Flash |
| Server | Uvicorn |


## Repository Structure

```

/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── data/
│       ├── recipes.json
│       └── ingredients.json
├── README.md

```



## Live Deployment

### Backend
https://smartchef-backend-oq3n.onrender.com/



## API Endpoints

### Health Check
```

GET /

```
Returns API status and recipe count.

### Get All Ingredients
```

GET /api/ingredients

```

### Get All Recipes
```

GET /api/recipes

```

### Match Ingredients With Recipes
```

POST /api/recipes/match

````

**Request Body**
```json
{
  "user_ingredients": ["egg", "milk", "flour"]
}
````

**Response Includes**

* Matched recipes
* Similarity scores
* Matched ingredients
* Missing ingredients
* AI-generated cooking steps

### Recompute TF-IDF Index

```
POST /api/recompute-index
```



## Running Locally

### Backend Setup

1. Add dataset files:

```
backend/data/recipes.json
backend/data/ingredients.json
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:

```
http://localhost:8000
```



### Frontend Setup

1. Open `frontend/index.html` directly
   **OR**
2. Serve via a local server:

```bash
python -m http.server
```

Open in browser:

```
http://localhost:8000
```

(Adjust API base URL in `script.js` if needed.)



## Deployment Notes

* Backend works on Render, Railway, or any Python hosting platform
* Use the following command for production:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

* Frontend can be hosted on GitHub Pages, Netlify, or Vercel


## Requirements

```
fastapi>=0.95
uvicorn[standard]>=0.22
pydantic>=1.10
```


