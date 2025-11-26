import { RecipeMatch } from "@/types/recipe";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold pr-8">{recipe.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[75vh] pr-4">
          <div className="space-y-8">
            {/* Meta info */}
            <div className="flex flex-wrap gap-6 items-center pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <div className="text-sm">
                  <span className="font-medium">Prep:</span> {recipe.prepTime} min
                  <span className="mx-2">|</span>
                  <span className="font-medium">Cook:</span> {recipe.cookTime} min
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{recipe.difficulty}</span>
              </div>
              {recipe.cuisine && (
                <div className="text-sm">
                  <span className="font-medium">Cuisine:</span> {recipe.cuisine}
                </div>
              )}
              <MatchBadge percentage={recipe.matchPercentage} />
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-bold mb-4">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.ingredients.map((ingredient, idx) => {
                  const hasIngredient = recipe.hasIngredients.includes(ingredient);
                  return (
                    <div
                      key={`${ingredient}-${idx}`}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        hasIngredient
                          ? "bg-success/10 border-success/30"
                          : "bg-muted/50 border-border"
                      }`}
                    >
                      {hasIngredient ? (
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${
                        hasIngredient ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {ingredient}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-bold mb-4">Instructions</h3>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-foreground/90 pt-1 leading-relaxed flex-1">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
