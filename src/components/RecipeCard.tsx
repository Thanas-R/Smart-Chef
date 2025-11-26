import { RecipeMatch } from "@/types/recipe";
import { getIngredientEmojis } from "@/data/constants";
import { MatchBadge } from "./MatchBadge";
import { Clock } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeMatch;
  onClick: () => void;
}

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const emojis = getIngredientEmojis(recipe.ingredients);
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <button
      onClick={onClick}
      className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] text-left w-full animate-slide-up"
    >
      {/* Emoji visualization */}
      <div className="flex flex-wrap gap-1 mb-3 min-h-[2rem]">
        {emojis.slice(0, 6).map((emoji, idx) => (
          <span key={idx} className="text-2xl">
            {emoji}
          </span>
        ))}
        {emojis.length > 6 && (
          <span className="text-2xl text-muted-foreground">+{emojis.length - 6}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {recipe.title}
      </h3>

      {/* Meta info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{totalTime} min</span>
          <span className="text-xs">•</span>
          <span>{recipe.difficulty}</span>
        </div>
        <MatchBadge percentage={recipe.matchPercentage} />
      </div>

      {/* Missing ingredients hint */}
      {recipe.missingIngredients.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Missing: {recipe.missingIngredients.slice(0, 3).join(", ")}
            {recipe.missingIngredients.length > 3 && ` +${recipe.missingIngredients.length - 3}`}
          </p>
        </div>
      )}
    </button>
  );
};
