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
        <div className="bg-card/60 backdrop-blur-2xl border-2 border-border/50 rounded-2xl p-6 shadow-2xl hover:border-primary/30 transition-all duration-300">
          <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
            {selectedIngredients.map((ingredient) => (
              <div
                key={ingredient}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-semibold animate-fade-in hover:bg-primary/30 transition-colors"
              >
                <span>{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="hover:bg-primary/40 rounded-full p-1 transition-colors"
                  aria-label={`Remove ${ingredient}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {selectedIngredients.length === 0 && (
              <p className="text-muted-foreground text-sm py-1">Start typing to add ingredients...</p>
            )}
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an ingredient (e.g., Tomato, Garlic, Rice)..."
                className="pl-12 bg-background/80 border-border h-14 text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              onClick={onSearch}
              disabled={selectedIngredients.length === 0}
              className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base disabled:opacity-40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all"
            >
              Find Recipes
            </Button>
          </div>
        </div>

        {/* Dropdown suggestions */}
        {showSuggestions && (
          <div className="absolute top-full mt-2 w-full bg-popover/95 backdrop-blur-lg border-2 border-border rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto animate-fade-in">
            {filteredSuggestions.slice(0, 10).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addIngredient(suggestion)}
                className="w-full text-left px-5 py-3 hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium border-b border-border/50 last:border-0"
              >
                {suggestion}
              </button>
            ))}
            {filteredSuggestions.length > 10 && (
              <div className="px-5 py-2 text-xs text-muted-foreground text-center">
                +{filteredSuggestions.length - 10} more ingredients available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
