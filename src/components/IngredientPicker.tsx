import { useState, useRef, useEffect } from "react";
import { X, Search } from "lucide-react";
import { ALL_INGREDIENTS } from "@/data/constants";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface IngredientPickerProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onSearch: () => void;
}

export const IngredientPicker = ({
  selectedIngredients,
  onIngredientsChange,
  onSearch,
}: IngredientPickerProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = ALL_INGREDIENTS.filter(
        (ingredient) =>
          ingredient.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedIngredients.includes(ingredient)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, selectedIngredients]);

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      onIngredientsChange([...selectedIngredients, ingredient]);
      setInputValue("");
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(selectedIngredients.filter((i) => i !== ingredient));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        addIngredient(filteredSuggestions[0]);
      } else if (inputValue.trim()) {
        addIngredient(inputValue.trim());
      } else if (selectedIngredients.length > 0) {
        onSearch();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="relative">
        {/* Frosted glass search bar */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl">
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedIngredients.map((ingredient) => (
              <div
                key={ingredient}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm font-medium animate-fade-in"
              >
                <span>{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="hover:bg-background/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an ingredient..."
                className="pl-10 bg-background/60 border-border/50 h-12 text-base"
              />
            </div>
            <Button
              onClick={onSearch}
              disabled={selectedIngredients.length === 0}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Find Recipes
            </Button>
          </div>
        </div>

        {/* Dropdown suggestions */}
        {showSuggestions && (
          <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto animate-fade-in">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addIngredient(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
