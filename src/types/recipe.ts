export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine?: string;
  note?: string;
  description?: string;
  servings?: number;
  equipment?: string[];
  chef_tips?: string[];
}

export interface RecipeMatch extends Recipe {
  matchPercentage: number;
  missingIngredients: string[];
  hasIngredients: string[];
}
