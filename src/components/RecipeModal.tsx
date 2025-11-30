import { useState } from "react";
import { RecipeMatch } from "@/types/recipe";
import { MatchBadge } from "./MatchBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, ChefHat, Check, X, Sparkles } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface RecipeModalProps {
  recipe: RecipeMatch | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  const [localRecipe, setLocalRecipe] = useState<RecipeMatch | null>(recipe);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!recipe) return null;

  const displayRecipe = localRecipe || recipe;
  const hasInstructions = displayRecipe.instructions && displayRecipe.instructions.length > 0;

  const handleGenerateInstructions = async () => {
    setIsGenerating(true);
    try {
      const instructions = await api.generateInstructions(
        displayRecipe.id,
        displayRecipe.title,
        displayRecipe.ingredients
      );
      
      setLocalRecipe({ ...displayRecipe, instructions });
      
      toast({
        title: "Instructions generated!",
        description: "AI-powered cooking steps are ready.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate instructions",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-2 border-border rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-4xl font-serif font-bold pr-8 text-foreground">{recipe.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[75vh] pr-4">
          <div className="space-y-8">
            {/* Meta info */}
            <div className="flex flex-wrap gap-3 items-center pb-6 border-b border-border">
              <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-sm font-semibold text-foreground">
                  <span>Prep:</span> {recipe.prepTime}m
                  <span className="mx-2">•</span>
                  <span>Cook:</span> {recipe.cookTime}m
                </div>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                <ChefHat className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{recipe.difficulty}</span>
              </div>
              {recipe.cuisine && (
                <div className="bg-secondary/50 px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-foreground">{recipe.cuisine}</span>
                </div>
              )}
              <MatchBadge percentage={recipe.matchPercentage} />
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-2xl font-serif font-bold mb-5 text-foreground">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayRecipe.ingredients.map((ingredient, idx) => {
                  const hasIngredient = displayRecipe.hasIngredients.includes(ingredient);
                  return (
                    <div
                      key={`${ingredient}-${idx}`}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${
                        hasIngredient
                          ? "bg-success/5 border-success/30"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      {hasIngredient ? (
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-sm font-semibold ${
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
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-serif font-bold text-foreground">Instructions</h3>
                {!hasInstructions && (
                  <Button
                    onClick={handleGenerateInstructions}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? "Generating..." : "Generate Instructions"}
                  </Button>
                )}
              </div>
              {hasInstructions ? (
                <div className="space-y-5">
                  {displayRecipe.instructions.map((instruction, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-bold shadow-md">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-foreground/80 pt-2 leading-relaxed flex-1 font-medium">
                        {instruction}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                  <p className="text-muted-foreground">
                    No instructions yet. Click "Generate Instructions" to create them with AI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
