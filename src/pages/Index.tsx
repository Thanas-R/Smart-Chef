import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeModal } from "@/components/RecipeModal";
import { RecipeMatch } from "@/types/recipe";
import { MOCK_RECIPES } from "@/data/constants";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecipeMatch[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeMatch | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateMatches = () => {
    if (selectedIngredients.length === 0) {
      return;
    }

    const matches: RecipeMatch[] = MOCK_RECIPES.map((recipe) => {
      const recipeIngredients = new Set(recipe.ingredients.map((i) => i.toLowerCase()));
      const userIngredients = new Set(selectedIngredients.map((i) => i.toLowerCase()));

      const hasIngredients = recipe.ingredients.filter((ingredient) =>
        userIngredients.has(ingredient.toLowerCase())
      );

      const missingIngredients = recipe.ingredients.filter(
        (ingredient) => !userIngredients.has(ingredient.toLowerCase())
      );

      const matchPercentage = Math.round(
        (hasIngredients.length / recipe.ingredients.length) * 100
      );

      return {
        ...recipe,
        matchPercentage,
        missingIngredients,
        hasIngredients,
      };
    });

    // Sort by match percentage (descending)
    const sortedMatches = matches
      .filter((match) => match.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    setRecommendations(sortedMatches);
    setShowResults(true);
  };

  const resetSearch = () => {
    setShowResults(false);
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {!showResults ? (
        <Hero
          selectedIngredients={selectedIngredients}
          onIngredientsChange={setSelectedIngredients}
          onSearch={calculateMatches}
        />
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 space-y-4">
            <Button
              onClick={resetSearch}
              variant="ghost"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              New Search
            </Button>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Found {recommendations.length} recipes
              </h2>
              <p className="text-muted-foreground">
                Based on: {selectedIngredients.join(", ")}
              </p>
            </div>
          </div>

          <RecipeGrid
            recipes={recommendations}
            onRecipeClick={setSelectedRecipe}
          />
        </div>
      )}

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
};

export default Index;
