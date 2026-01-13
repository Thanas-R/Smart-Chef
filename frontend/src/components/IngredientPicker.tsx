import { useState, useRef, useEffect } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const ingredients = await api.getIngredients();
        setAllIngredients(ingredients);
      } catch (error) {
        toast({
          title: "Error loading ingredients",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allIngredients.filter(
        (ingredient) =>
          ingredient.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedIngredients.includes(ingredient)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, selectedIngredients, allIngredients]);

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
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        addIngredient(filteredSuggestions[highlightedIndex]);
      } else if (filteredSuggestions.length > 0) {
        addIngredient(filteredSuggestions[0]);
      } else if (inputValue.trim()) {
        addIngredient(inputValue.trim());
      } else if (selectedIngredients.length > 0) {
        onSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="relative bg-card border-2 border-border rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedIngredients.map((ingredient) => (
            <div
              key={ingredient}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-sm"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(ingredient)}
                className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder={loading ? "Loading ingredients..." : "Type an ingredient (e.g., tomato, rice, chicken)..."}
              disabled={loading}
              className="w-full pl-12 pr-4 py-4 bg-secondary/30 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all font-medium disabled:opacity-50"
            />
          </div>
          <button
            onClick={onSearch}
            disabled={selectedIngredients.length === 0}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:hover:shadow-md flex items-center gap-2 hover:-translate-y-0.5 justify-center"
          >
            Find Recipes
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-card border-2 border-border rounded-2xl shadow-xl max-h-64 overflow-y-auto animate-fade-in">
            {filteredSuggestions.map((ingredient, index) => (
              <button
                key={ingredient}
                onClick={() => addIngredient(ingredient)}
                className={`w-full text-left px-5 py-3.5 hover:bg-primary/5 transition-colors text-foreground border-b border-border/50 last:border-b-0 ${
                  index === highlightedIndex ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {ingredient.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold capitalize text-foreground">{ingredient}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
