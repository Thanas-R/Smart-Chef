import { ChefHat } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Smart Chef</h1>
          </div>
        </div>
        
        <div className="text-primary font-semibold text-sm tracking-wide">
          Chemakya Pesters
        </div>
      </div>
    </header>
  );
};
