import { RecipeMatch } from "@/types/recipe";
import { MatchBadge } from "./MatchBadge";
import { Clock, ChefHat } from "lucide-react";
interface RecipeCardProps {
  recipe: RecipeMatch;
  onClick: () => void;
}
export const RecipeCard = ({
  recipe,
  onClick
}: RecipeCardProps) => {
  const totalTime = recipe.prepTime + recipe.cookTime;
  return <button onClick={onClick} className="group bg-card border-2 border-border rounded-3xl p-6 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 text-left w-full animate-slide-up">
      {/* Title */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors leading-tight flex-1">
          {recipe.title}
        </h3>
        <MatchBadge percentage={recipe.matchPercentage} />
      </div>

      {/* Meta info */}
      

      {/* Ingredients summary */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{
            width: `${recipe.matchPercentage}%`
          }} />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {recipe.hasIngredients.length}/{recipe.ingredients.length}
          </span>
        </div>
        
        {recipe.missingIngredients.length > 0 && <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3">
            <p className="text-xs font-semibold text-primary mb-1">Missing:</p>
            <p className="text-xs text-foreground/70">
              {recipe.missingIngredients.slice(0, 3).join(", ")}
              {recipe.missingIngredients.length > 3 && ` +${recipe.missingIngredients.length - 3}`}
            </p>
          </div>}
      </div>
    </button>;
};