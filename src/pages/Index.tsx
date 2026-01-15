import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { AuthScreen } from "@/components/AuthScreen";
import { HomeScreen } from "@/components/HomeScreen";

type AppScreen = "splash" | "auth" | "home";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");

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
