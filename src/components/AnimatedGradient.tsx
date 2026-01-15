import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedGradientProps {
  children?: ReactNode;
  variant?: "vibrant" | "calm";
  className?: string;
}

export const AnimatedGradient = ({ 
  children, 
  variant = "vibrant",
  className = "" 
}: AnimatedGradientProps) => {
  return (
    <motion.div
      className={`relative min-h-screen overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated gradient layer */}
      <motion.div
        className={`absolute inset-0 ${variant === "vibrant" ? "gradient-animated" : "gradient-calm"}`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Floating orbs for depth */}
      <motion.div
        className="absolute top-1/4 -left-20 h-64 w-64 rounded-full opacity-30"
        style={{
          background: variant === "vibrant" 
            ? "radial-gradient(circle, hsl(175 70% 45% / 0.6), transparent)"
            : "radial-gradient(circle, hsl(185 70% 55% / 0.4), transparent)",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 -right-20 h-80 w-80 rounded-full opacity-40"
        style={{
          background: variant === "vibrant"
            ? "radial-gradient(circle, hsl(210 85% 55% / 0.5), transparent)"
            : "radial-gradient(circle, hsl(200 75% 60% / 0.4), transparent)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          background: variant === "vibrant"
            ? "radial-gradient(circle, hsl(190 75% 48% / 0.6), transparent)"
            : "radial-gradient(circle, hsl(195 65% 70% / 0.5), transparent)",
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
