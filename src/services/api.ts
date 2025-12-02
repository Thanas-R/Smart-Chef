const BASE_URL = "https://smartchef-backend-oq3n.onrender.com";

export interface RecipeMatchRequest {
  ingredients: string[];
}

// Backend response format (snake_case)
interface BackendRecipeMatch {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine?: string;
  note?: string;
  match_percentage: number;
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
    const res = await fetch(`${BASE_URL}/api/recipes/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });
    if (!res.ok) {
      throw new Error(`Failed to match recipes: ${res.statusText}`);
    }
    const data: RecipeMatchResponse = await res.json();
    
    // Filter out recipes with 0% match and calculate hasIngredients/missingIngredients
    const filteredRecipes = data.matches
      .filter(recipe => recipe.match_percentage > 0)
      .map(recipe => {
        const recipeIngredients = recipe.ingredients || [];
        const userIngredients = ingredients.map(i => i.toLowerCase());
        
        // Calculate which ingredients the user has
        const hasIngredients = recipeIngredients.filter(ingredient => 
          userIngredients.some(userIng => 
            ingredient.toLowerCase().includes(userIng) || 
            userIng.includes(ingredient.toLowerCase())
          )
        );
        
        // Calculate which ingredients are missing
        const missingIngredients = recipeIngredients.filter(ingredient => 
          !userIngredients.some(userIng => 
            ingredient.toLowerCase().includes(userIng) || 
            userIng.includes(ingredient.toLowerCase())
          )
        );
        
        // Destructure to exclude match_percentage and convert to matchPercentage
        const { match_percentage, ...recipeData } = recipe;
        
        return {
          ...recipeData,
          matchPercentage: match_percentage, // Convert to camelCase for frontend
          hasIngredients,
          missingIngredients
        };
      });
    
    // Sort by match percentage descending (highest match first)
    return filteredRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
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
