import { IngredientPicker } from "./IngredientPicker";
import { ChefHat } from "lucide-react";
interface HeroProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onSearch: () => void;
}
export const Hero = ({
  selectedIngredients,
  onIngredientsChange,
  onSearch
}: HeroProps) => {
  return <div className="min-h-screen flex items-center justify-center px-4 pt-12 pb-16">
      {/* Content */}
      <div className="w-full max-w-6xl mx-auto text-center space-y-12 py-12">
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-center">
            
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight leading-tight text-foreground">
            Find Your Perfect
            <span className="block text-primary mt-2">Recipe</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enter the ingredients you have, and discover delicious recipes you can make today.
          </p>
        </div>

        <IngredientPicker selectedIngredients={selectedIngredients} onIngredientsChange={onIngredientsChange} onSearch={onSearch} />
      </div>
    </div>;
};