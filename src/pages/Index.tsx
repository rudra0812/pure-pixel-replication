import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { AuthScreen } from "@/components/AuthScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { useAuth } from "@/hooks/useAuth";

type AppScreen = "splash" | "auth" | "home" | "loading";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("loading");
  const { isAuthenticated, isLoading } = useAuth();

  // Initialize screen based on auth state
  useEffect(() => {
    if (!isLoading) {
      setCurrentScreen(isAuthenticated ? "home" : "splash");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <motion.div
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentScreen === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SplashScreen onGetStarted={() => setCurrentScreen("auth")} />
          </motion.div>
        )}

        {currentScreen === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthScreen
              onBack={() => setCurrentScreen("splash")}
              onAuthenticated={() => setCurrentScreen("home")}
            />
          </motion.div>
        )}

        {currentScreen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen onLogout={() => setCurrentScreen("splash")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
