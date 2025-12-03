import { useState, useEffect } from "react";
import { RecipeMatch } from "@/types/recipe";
import { MatchBadge } from "./MatchBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, ChefHat, Check, X, Sparkles, Utensils, Lightbulb } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GooeyLoader } from "./ui/gooey-loader";

interface RecipeModalProps {
  recipe: RecipeMatch | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  const [localRecipe, setLocalRecipe] = useState<RecipeMatch | null>(recipe);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDetails, setIsGeneratingDetails] = useState(false);

  useEffect(() => {
    if (recipe && isOpen) {
      // Reset local recipe when a new recipe is opened
      setLocalRecipe(recipe);
      // Auto-generate details if missing
      if (!recipe.description || !recipe.instructions || recipe.instructions.length === 0) {
        handleGenerateDetails();
      }
    } else if (!isOpen) {
      // Reset when modal closes
      setLocalRecipe(null);
    }
  }, [recipe?.id, isOpen]);

  if (!recipe) return null;

  const displayRecipe = localRecipe || recipe;
  const hasInstructions = displayRecipe.instructions && displayRecipe.instructions.length > 0;
  const hasIngredientsList = displayRecipe.hasIngredients || [];
  const ingredients = displayRecipe.ingredients || [];
  const prepTime = displayRecipe.prepTime || 0;
  const cookTime = displayRecipe.cookTime || 0;
  
  // relevanceScore for badge, fallback to matchPercentage
  const relevance = typeof displayRecipe.relevanceScore === "number" 
    ? displayRecipe.relevanceScore 
    : (displayRecipe.matchPercentage || 0);

  // Helper to check if ingredient is matched (supports fuzzy matching from backend)
  const normalize = (s?: string) => (s || "").toLowerCase().trim().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const ingredientIsMatched = (origIngredient: string) => {
    const normalizedOrig = normalize(origIngredient);
    return hasIngredientsList.some(h => 
      normalize(h) === normalizedOrig || 
      (h || "").trim().toLowerCase() === (origIngredient || "").trim().toLowerCase()
    );
  };

  const handleGenerateDetails = async () => {
    setIsGeneratingDetails(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe-details', {
        body: {
          recipeName: displayRecipe.title,
          ingredients: displayRecipe.ingredients
        }
      });

      if (error) throw error;

      setLocalRecipe({
        ...displayRecipe,
        description: data.description,
        cuisine: data.cuisine || displayRecipe.cuisine,
        prepTime: data.prep_time_minutes || displayRecipe.prepTime,
        cookTime: data.cook_time_minutes || displayRecipe.cookTime,
        servings: data.servings,
        difficulty: data.difficulty || displayRecipe.difficulty,
        instructions: data.instructions || [],
        equipment: data.equipment || [],
        chef_tips: data.chef_tips || []
      });

    } catch (error) {
      console.error("Failed to generate recipe details:", error);
      toast({
        title: "Failed to generate recipe details",
        description: "Using basic recipe information",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDetails(false);
    }
  };

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
            {/* Ingredients - Always show first */}
            <div>
              <h3 className="text-2xl font-serif font-bold mb-5 text-foreground">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ingredients.map((ingredient, idx) => {
                  const matched = ingredientIsMatched(ingredient);
                  return (
                    <div
                      key={`${ingredient}-${idx}`}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${
                        matched
                          ? "bg-success/5 border-success/30"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      {matched ? (
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-sm font-semibold ${
                        matched ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {ingredient}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Loading animation while generating */}
            {isGeneratingDetails && (
              <div className="flex items-center justify-center py-8 bg-primary/5 rounded-2xl">
                <GooeyLoader message="Generating recipe details with AI..." />
              </div>
            )}

            {/* Show details only after generation completes */}
            {!isGeneratingDetails && displayRecipe.description && (
              <>
                {/* Description */}
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                  <p className="text-foreground/80 leading-relaxed">{displayRecipe.description}</p>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-3 items-center pb-6 border-b border-border">
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                    <Clock className="w-4 h-4 text-primary" />
                    <div className="text-sm font-semibold text-foreground">
                      <span>Prep:</span> {prepTime}m
                      <span className="mx-2">•</span>
                      <span>Cook:</span> {cookTime}m
                    </div>
                  </div>
                  {displayRecipe.difficulty && (
                    <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                      <ChefHat className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{displayRecipe.difficulty}</span>
                    </div>
                  )}
                  {displayRecipe.cuisine && (
                    <div className="bg-secondary/50 px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-foreground">{displayRecipe.cuisine}</span>
                    </div>
                  )}
                  {displayRecipe.servings && (
                    <div className="bg-secondary/50 px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-foreground">Serves {displayRecipe.servings}</span>
                    </div>
                  )}
                  <MatchBadge relevance={relevance} />
                </div>
              </>
            )}

            {/* Equipment - Only show after generation */}
            {!isGeneratingDetails && displayRecipe.equipment && displayRecipe.equipment.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-serif font-bold text-foreground">Equipment Needed</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayRecipe.equipment.map((item, idx) => (
                    <div key={idx} className="bg-secondary/50 px-4 py-2 rounded-full border border-border">
                      <span className="text-sm font-medium text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions - Only show after generation */}
            {!isGeneratingDetails && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-serif font-bold text-foreground">Instructions</h3>
                {!hasInstructions && !isGeneratingDetails && (
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
                  {(displayRecipe.instructions || []).map((instruction, idx) => (
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
              ) : !isGeneratingDetails && (
                <div className="text-center py-8 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                  <p className="text-muted-foreground">
                    No instructions yet. Click "Generate Instructions" to create them with AI.
                  </p>
                </div>
              )}
            </div>
            )}

            {/* Chef Tips - Only show after generation */}
            {!isGeneratingDetails && displayRecipe.chef_tips && displayRecipe.chef_tips.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-serif font-bold text-foreground">Chef's Tips</h3>
                </div>
                <div className="space-y-3">
                  {displayRecipe.chef_tips.map((tip, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <span className="text-primary font-bold">💡</span>
                      <p className="text-sm text-foreground/80 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
