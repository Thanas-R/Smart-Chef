import { RecipeMatch } from "@/types/recipe";
import { RecipeCard } from "./RecipeCard";

interface RecipeGridProps {
  recipes: RecipeMatch[];
  onRecipeClick: (recipe: RecipeMatch) => void;
}

export const RecipeGrid = ({ recipes, onRecipeClick }: RecipeGridProps) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground">
          No recipes found with these ingredients.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adding more ingredients or removing some.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onRecipeClick(recipe)}
        />
      ))}
    </div>
  );
};
