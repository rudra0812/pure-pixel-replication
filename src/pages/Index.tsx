import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { AuthScreen } from "@/components/AuthScreen";
import { HomeScreen } from "@/components/HomeScreen";

type AppScreen = "splash" | "auth" | "home";

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -10 },
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === "splash" && (
          <motion.div
            key="splash"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <SplashScreen onGetStarted={() => setCurrentScreen("auth")} />
          </motion.div>
        )}

        {currentScreen === "auth" && (
          <motion.div
            key="auth"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
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
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <HomeScreen onLogout={() => setCurrentScreen("splash")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
