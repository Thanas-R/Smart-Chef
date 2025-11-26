import { RecipeMatch } from "@/types/recipe";
import { MatchBadge } from "./MatchBadge";
import { Clock, ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeMatch;
  onClick: () => void;
}

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <button
      onClick={onClick}
      className="group bg-card/90 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] text-left w-full animate-slide-up"
    >
      {/* Title */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight flex-1">
          {recipe.title}
        </h3>
        <MatchBadge percentage={recipe.matchPercentage} />
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{totalTime} min</span>
        </div>
        <span className="text-xs">•</span>
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4" />
          <span>{recipe.difficulty}</span>
        </div>
        {recipe.cuisine && (
          <>
            <span className="text-xs">•</span>
            <span>{recipe.cuisine}</span>
          </>
        )}
      </div>

      {/* Ingredients summary */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {recipe.hasIngredients.length} of {recipe.ingredients.length} ingredients available
        </p>
        
        {recipe.missingIngredients.length > 0 && (
          <div className="bg-warning/10 rounded-lg p-3">
            <p className="text-xs font-medium text-warning mb-1">You'll need:</p>
            <p className="text-xs text-warning/80">
              {recipe.missingIngredients.slice(0, 4).join(", ")}
              {recipe.missingIngredients.length > 4 && ` +${recipe.missingIngredients.length - 4} more`}
            </p>
          </div>
        )}
      </div>
    </button>
  );
};
