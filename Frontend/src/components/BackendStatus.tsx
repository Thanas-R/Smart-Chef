import { useState, useEffect } from "react";
import { Cloud, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BackendStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ping the backend to check if it's awake
    const checkBackend = async () => {
      try {
        const response = await fetch(
          "https://smartchef-backend-oq3n.onrender.com/api/ingredients"
        );
        if (response.ok) {
          setIsLoading(false);
          // Hide the status box after 2 seconds
          setTimeout(() => setIsVisible(false), 2000);
        }
      } catch {
        // Retry after 3 seconds if failed
        setTimeout(checkBackend, 3000);
      }
    };

    checkBackend();
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
            {isLoading ? (
              <>
                <Cloud className="w-4 h-4 text-primary animate-pulse" />
                <div className="text-xs">
                  <p className="font-medium text-foreground">Cloud waking up...</p>
                  <p className="text-muted-foreground">Backend loading</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-success" />
                <div className="text-xs">
                  <p className="font-medium text-foreground">Cloud ready!</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
