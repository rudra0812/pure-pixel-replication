import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { AuthScreen } from "@/components/AuthScreen";
import { HomeScreen } from "@/components/HomeScreen";

type AppScreen = "splash" | "auth" | "home";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.18,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AnimatePresence>
        {currentScreen === "splash" && (
          <motion.div
            key="splash"
            className="absolute inset-0"
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
            className="absolute inset-0"
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
            className="absolute inset-0"
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
