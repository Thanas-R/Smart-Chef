# SmartChef — Frontend

A web interface that connects to the SmartChef FastAPI backend to provide intelligent recipe matching and AI-generated cooking steps.

---

## Overview

The SmartChef frontend allows users to enter available ingredients and instantly receive recipe suggestions.  
It communicates directly with the backend to fetch:

- Matching recipes  
- Ingredient similarity scores  
- Matched and missing ingredient breakdown  
- AI-generated cooking instructions (Google Gemini 2.5 Flash)

---

## Tech Stack

| Layer            | Technologies Used              |
|------------------|--------------------------------|
| Presentation     | HTML, CSS                      |
| Client Logic     | JavaScript                     |
| Networking       | Fetch API                      |
| AI Services      | Google Gemini 2.5 Flash        |

---

## Backend Endpoints Used 

### **1. Get All Recipes**
GET https://smartchef-backend-oq3n.onrender.com/api/recipes

### **2. Get All Ingredients**
GET https://smartchef-backend-oq3n.onrender.com/api/ingredients

### **3. Match Ingredients With Recipes**
POST https://smartchef-backend-oq3n.onrender.com/api/recipes/match

**Sample Request Body:**
[The backend responds with matched recipes, similarity scores, and ingredient analysis]

```json
{
  "user_ingredients": ["egg", "milk", "flour"]
}

