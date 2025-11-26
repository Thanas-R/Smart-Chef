import heroImage from "@/assets/hero-bg-dark.jpg";
import { IngredientPicker } from "./IngredientPicker";

interface HeroProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onSearch: () => void;
}

export const Hero = ({
  selectedIngredients,
  onIngredientsChange,
  onSearch,
}: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-10 py-20">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            What can you cook
            <span className="block text-primary mt-2">right now?</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Enter the ingredients you have, and discover delicious recipes you can make today.
          </p>
        </div>

        <IngredientPicker
          selectedIngredients={selectedIngredients}
          onIngredientsChange={onIngredientsChange}
          onSearch={onSearch}
        />
      </div>
    </div>
  );
};
