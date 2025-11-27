import { ChefHat } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-serif font-bold text-foreground">Smart Chef</h1>
        </div>
        
        <div className="text-primary font-semibold text-xs tracking-wide">
          Chemakya Pesters
        </div>
      </div>
    </header>
  );
};
