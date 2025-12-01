// RecipeCard.tsx
import { RecipeMatch } from "@/types/recipe";
import { MatchBadge } from "./MatchBadge";
import { Clock, ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeMatch;
  onClick: () => void;
}
export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const hasIngredients = recipe.hasIngredients || [];
  const missingIngredients = recipe.missingIngredients || [];
  const ingredients = recipe.ingredients || [];

  // Normalize percentage (same logic as MatchBadge)
  const normalizePct = (p: any) => {
    if (p === null || p === undefined) return 0;
    const n = Number(p);
    if (Number.isNaN(n)) return 0;
    const scaled = n <= 1 ? Math.round(n * 100) : Math.round(n);
    return Math.min(100, Math.max(0, scaled));
  };

  const pct = normalizePct(recipe.matchPercentage);

  return (
    <button
      onClick={onClick}
      className="group bg-card border-2 border-border rounded-3xl p-6 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 text-left w-full animate-slide-up"
    >
      {/* Title */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-serif font-bold mb-1 group-hover:text-primary transition-colors leading-tight flex-1">
            {recipe.title || recipe.name}
          </h3>
          {recipe.note && <p className="text-sm text-gray-600">{recipe.note}</p>}
        </div>
        <MatchBadge percentage={pct} />
      </div>

      {/* Meta info */}
      <div className="text-xs text-gray-500 mb-3">
        {totalTime ? `Total ${totalTime}m • ` : ""}
        {recipe.difficulty ? `${recipe.difficulty}` : ""}
      </div>

      {/* Ingredients summary */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {hasIngredients.length}/{ingredients.length || 1}
          </span>
        </div>

        {missingIngredients.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3">
            <p className="text-xs font-semibold text-primary mb-1">Missing:</p>
            <p className="text-xs text-foreground/70">
              {missingIngredients.slice(0, 3).join(", ")}
              {missingIngredients.length > 3 && ` +${missingIngredients.length - 3}`}
            </p>
          </div>
        )}
      </div>
    </button>
  );
};
