export interface Recipe {
  id: string;
  title: string;
  name?: string;
  ingredients: string[];
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  cuisine?: string;
  note?: string;
  description?: string;
  servings?: number;
  equipment?: string[];
  chef_tips?: string[];
}

export interface RecipeMatch extends Recipe {
  hasIngredients?: string[];
  missingIngredients?: string[];
  matchPercentage?: number;
  relevanceScore?: number;
}
