const BASE_URL = "https://smartchef-backend-oq3n.onrender.com";

export interface RecipeMatchRequest {
  ingredients: string[];
}

// Backend response format (snake_case)
interface BackendRecipeMatch {
  id: string;
  title: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  cuisine?: string;
  note?: string;
  match_percentage?: number;
  matchPercentage?: number;
  relevanceScore?: number;
  hasIngredients?: string[];
  missingIngredients?: string[];
}


export interface RecipeMatchResponse {
  matches: BackendRecipeMatch[];
}

// Frontend format (camelCase) - imported from types/recipe.ts
import { RecipeMatch } from "@/types/recipe";

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

  async matchRecipes(ingredients: string[]): Promise<RecipeMatch[]> {
    const res = await fetch(`${BASE_URL}/api/recipes/match?sort=tfidf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });
    if (!res.ok) {
      throw new Error(`Failed to match recipes: ${res.statusText}`);
    }
    const data: RecipeMatchResponse = await res.json();

    const filteredRecipes = (data.matches || [])
      .map((recipe) => {
        const recipeIngredients = recipe.ingredients || [];
        const userIngredients = ingredients.map((i) => i.toLowerCase());

        // Prefer backend-provided has/missing ingredients if available
        const hasIngredients =
          recipe.hasIngredients && recipe.hasIngredients.length > 0
            ? recipe.hasIngredients
            : recipeIngredients.filter((ingredient) =>
                userIngredients.some((userIng) =>
                  ingredient.toLowerCase().includes(userIng) ||
                  userIng.includes(ingredient.toLowerCase())
                )
              );

        const missingIngredients =
          recipe.missingIngredients && recipe.missingIngredients.length > 0
            ? recipe.missingIngredients
            : recipeIngredients.filter((ingredient) =>
                !userIngredients.some((userIng) =>
                  ingredient.toLowerCase().includes(userIng) ||
                  userIng.includes(ingredient.toLowerCase())
                )
              );

        const rawMatch = recipe.match_percentage ?? recipe.matchPercentage ?? 0;
        const { match_percentage, matchPercentage, ...recipeData } = recipe;

        return {
          ...recipeData,
          matchPercentage: rawMatch,
          hasIngredients,
          missingIngredients,
        } as RecipeMatch;
      })
      // Filter out recipes with 0% match
      .filter((recipe) => recipe.matchPercentage > 0)
      // Sort by match percentage descending (highest match first)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return filteredRecipes;
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
