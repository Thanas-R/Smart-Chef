const BASE_URL = "https://smartchef-backend-oq3n.onrender.com";

export interface RecipeMatchResponse {
  id: string;
  title: string;
  name?: string;
  note?: string;
  ingredients: string[];
  instructions: string[];
  hasIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
  relevanceScore: number;
}

export interface IngredientsResponse {
  ingredients: string[];
}

export const api = {
  async getIngredients(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/api/ingredients`);
    if (!res.ok) {
      throw new Error(`Failed to fetch ingredients: ${res.statusText}`);
    }
    const data: IngredientsResponse = await res.json();
    return data.ingredients;
  },

  async matchRecipes(ingredients: string[]): Promise<RecipeMatchResponse[]> {
    const res = await fetch(`${BASE_URL}/api/recipes/match?sort=tfidf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });
    if (!res.ok) {
      throw new Error(`Failed to match recipes: ${res.statusText}`);
    }
    const data = await res.json();
    // Backend returns { matches: [...] }
    return data?.matches ?? [];
  },

  async generateInstructions(recipeId: string, recipeName: string, ingredients: string[]): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/api/generate-instructions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipeId, recipe_name: recipeName, ingredients }),
    });
    if (!res.ok) {
      throw new Error(`Failed to generate instructions: ${res.statusText}`);
    }
    const data = await res.json();
    return data.instructions;
  },
};
