import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeModal } from "@/components/RecipeModal";
import { Header } from "@/components/Header";
import { BackendStatus } from "@/components/BackendStatus";
import { RecipeMatch } from "@/types/recipe";
import { api } from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecipeMatch[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeMatch | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateMatches = async () => {
    if (selectedIngredients.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const matches = await api.matchRecipes(selectedIngredients);
      setRecommendations(matches);
      setShowResults(true);
    } catch (error) {
      toast({
        title: "Error finding recipes",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      ) : loading ? (
        <div className="container mx-auto px-6 py-28 max-w-7xl">
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">Finding recipes...</p>
          </div>
        </div>
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

      <BackendStatus />
    </div>
  );
};

export default Index;
