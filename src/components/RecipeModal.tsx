import { RecipeMatch } from "@/types/recipe";
import { getIngredientEmojis } from "@/data/constants";
import { MatchBadge } from "./MatchBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, ChefHat, Check, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface RecipeModalProps {
  recipe: RecipeMatch | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  if (!recipe) return null;

  const emojis = getIngredientEmojis(recipe.ingredients);
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{recipe.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Emoji visualization */}
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji, idx) => (
                <span key={idx} className="text-3xl">
                  {emoji}
                </span>
              ))}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span className="text-sm">
                  Prep: {recipe.prepTime}min | Cook: {recipe.cookTime}min
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ChefHat className="w-5 h-5" />
                <span className="text-sm">{recipe.difficulty}</span>
              </div>
              <MatchBadge percentage={recipe.matchPercentage} />
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient) => {
                  const hasIngredient = recipe.hasIngredients.includes(ingredient);
                  return (
                    <div
                      key={ingredient}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        hasIngredient
                          ? "bg-success/10 text-success-foreground"
                          : "bg-warning/10 text-warning-foreground"
                      }`}
                    >
                      {hasIngredient ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <X className="w-4 h-4 text-warning" />
                      )}
                      <span className="text-sm">{ingredient}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-foreground/90 pt-0.5">
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
