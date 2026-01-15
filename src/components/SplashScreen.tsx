import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AnimatedGradient } from "./AnimatedGradient";
import { Feather } from "lucide-react";

interface SplashScreenProps {
  onGetStarted: () => void;
}

const inspirationalQuotes = [
  { text: "Write your story, one day at a time.", author: "Journal" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "The life you write is the life you live.", author: "Unknown" },
  { text: "In the journal I do not just express myself more openly than I could to any person; I create myself.", author: "Susan Sontag" },
];

export const SplashScreen = ({ onGetStarted }: SplashScreenProps) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quote = inspirationalQuotes[quoteIndex];

  return (
    <AnimatedGradient variant="vibrant">
      <div className="flex min-h-screen flex-col items-center justify-center px-8 safe-area-top safe-area-bottom">
        {/* Logo/Icon */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.2 
          }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl shadow-lg">
            <Feather className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        {/* App Title */}
        <motion.h1
          className="mb-4 text-title text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Journal
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mb-16 text-body text-white/80 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Your private space for reflection
        </motion.p>

        {/* Animated Quote */}
        <motion.div
          className="mb-16 h-32 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-3 text-lg italic text-white/90 leading-relaxed">
                "{quote.text}"
              </p>
              <p className="text-secondary text-white/60">
                — {quote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Get Started Button */}
        <motion.button
          onClick={onGetStarted}
          className="h-14 px-14 rounded-2xl font-semibold text-lg shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: "white",
            color: "hsl(190 75% 35%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          }}
        >
          Get Started
        </motion.button>

        {/* Sign in link */}
        <motion.p
          className="mt-6 text-secondary text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Already have an account?{" "}
          <button 
            onClick={onGetStarted}
            className="font-medium text-white underline underline-offset-2 touch-target"
          >
            Sign In
          </button>
        </motion.p>
      </div>
    </AnimatedGradient>
  );
};
