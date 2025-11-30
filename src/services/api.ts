const BASE_URL = "https://smartchef-backend-oq3n.onrender.com";

export interface RecipeMatchRequest {
  ingredients: string[];
}

export interface RecipeMatchResponse {
  matches: Array<{
    id: string;
    title: string;
    ingredients: string[];
    instructions: string[];
    prepTime: number;
    cookTime: number;
    difficulty: "Easy" | "Medium" | "Hard";
    cuisine?: string;
    note?: string;
    matchPercentage: number;
    missingIngredients: string[];
    hasIngredients: string[];
  }>;
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

  async matchRecipes(ingredients: string[]): Promise<RecipeMatchResponse["matches"]> {
    const res = await fetch(`${BASE_URL}/api/recipes/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });
    if (!res.ok) {
      throw new Error(`Failed to match recipes: ${res.statusText}`);
    }
    const data: RecipeMatchResponse = await res.json();
    return data.matches;
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
