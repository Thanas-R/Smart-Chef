import heroImage from "@/assets/hero-bg.jpg";
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
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8 py-20">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            What can you cook
            <span className="block text-primary">right now?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
