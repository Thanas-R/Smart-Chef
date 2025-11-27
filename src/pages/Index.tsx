import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeModal } from "@/components/RecipeModal";
import { AboutDialog } from "@/components/AboutDialog";
import { Header } from "@/components/Header";
import { RecipeMatch } from "@/types/recipe";
import { MOCK_RECIPES } from "@/data/constants";
import { ArrowLeft, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecipeMatch[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeMatch | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const calculateMatches = () => {
    if (selectedIngredients.length === 0) {
      return;
    }

    const userIngredients = new Set(selectedIngredients.map((i) => i.toLowerCase().trim()));

    const matches: RecipeMatch[] = MOCK_RECIPES.map((recipe) => {
      const hasIngredients = recipe.ingredients.filter((ingredient) =>
        userIngredients.has(ingredient.toLowerCase().trim())
      );

      const missingIngredients = recipe.ingredients.filter(
        (ingredient) => !userIngredients.has(ingredient.toLowerCase().trim())
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
      <Header />
      
      {!showResults ? (
        <Hero
          selectedIngredients={selectedIngredients}
          onIngredientsChange={setSelectedIngredients}
          onSearch={calculateMatches}
        />
      ) : (
        <div className="container mx-auto px-6 py-28 max-w-7xl">
          <div className="mb-12 space-y-6 animate-fade-in">
            <Button
              onClick={resetSearch}
              variant="ghost"
              className="gap-2 hover:bg-secondary rounded-2xl px-6 py-6 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              New Search
            </Button>
            <div className="space-y-3">
              <h2 className="text-5xl font-serif font-bold text-foreground">
                Found {recommendations.length} {recommendations.length === 1 ? 'Recipe' : 'Recipes'}
              </h2>
              <p className="text-lg text-muted-foreground">
                Based on: <span className="text-primary font-semibold">{selectedIngredients.join(", ")}</span>
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

      <AboutDialog
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />

      {/* Footer with Chef Icon */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowAbout(true)}
          className="group bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-6 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-primary/50"
          aria-label="About Us"
        >
          <ChefHat className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default Index;
