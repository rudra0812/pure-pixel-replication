import { motion } from "framer-motion";

export type MoodType = "neutral" | "happy" | "sad" | "excited" | "anxious" | "calm";

interface MoodEmojiProps {
  mood: MoodType;
  size?: number;
  isAnalyzing?: boolean;
}

const moodConfigs: Record<MoodType, { eyebrows: number; mouth: string; eyeScale: number; color: string }> = {
  neutral: { eyebrows: 0, mouth: "M 35,70 Q 50,75 65,70", eyeScale: 1, color: "hsl(var(--primary))" },
  happy: { eyebrows: -5, mouth: "M 35,65 Q 50,85 65,65", eyeScale: 1.1, color: "hsl(142, 76%, 45%)" },
  sad: { eyebrows: 8, mouth: "M 35,78 Q 50,65 65,78", eyeScale: 0.9, color: "hsl(220, 70%, 55%)" },
  excited: { eyebrows: -8, mouth: "M 32,60 Q 50,90 68,60", eyeScale: 1.3, color: "hsl(45, 93%, 55%)" },
  anxious: { eyebrows: 10, mouth: "M 38,72 Q 50,70 62,72", eyeScale: 1.2, color: "hsl(280, 60%, 55%)" },
  calm: { eyebrows: 0, mouth: "M 38,68 Q 50,76 62,68", eyeScale: 1, color: "hsl(175, 60%, 45%)" },
};

const moodLabels: Record<MoodType, string> = {
  neutral: "Neutral",
  happy: "Happy",
  sad: "Feeling Blue",
  excited: "Excited",
  anxious: "Anxious",
  calm: "Peaceful",
};

export const MoodEmoji = ({ mood, size = 200, isAnalyzing = false }: MoodEmojiProps) => {
  const config = moodConfigs[mood];
  
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={isAnalyzing ? { 
          rotateY: [0, 360],
        } : {}}
        transition={isAnalyzing ? { 
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        } : {}}
      >
        {/* 3D Sphere effect with gradients */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
        >
          <defs>
            {/* Main gradient for 3D sphere effect */}
            <radialGradient id="sphereGradient" cx="30%" cy="30%" r="70%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="hsl(50, 95%, 85%)" />
              <stop offset="50%" stopColor="hsl(45, 93%, 70%)" />
              <stop offset="100%" stopColor="hsl(40, 85%, 55%)" />
            </radialGradient>
            
            {/* Highlight for glossy effect */}
            <radialGradient id="highlight" cx="35%" cy="25%" r="25%">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            
            {/* Shadow gradient */}
            <radialGradient id="shadow" cx="50%" cy="90%" r="50%">
              <stop offset="0%" stopColor="hsl(35, 70%, 40%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(35, 70%, 40%)" stopOpacity="0" />
            </radialGradient>

            {/* Blush gradient */}
            <radialGradient id="blush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(350, 80%, 75%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(350, 80%, 75%)" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Main face circle */}
          <circle cx="50" cy="50" r="45" fill="url(#sphereGradient)" />
          
          {/* Glossy highlight */}
          <circle cx="50" cy="50" r="45" fill="url(#highlight)" />
          
          {/* Bottom shadow for depth */}
          <ellipse cx="50" cy="85" rx="30" ry="8" fill="url(#shadow)" />
          
          {/* Left blush */}
          <motion.ellipse
            cx="25"
            cy="55"
            rx="8"
            ry="5"
            fill="url(#blush)"
            animate={{ opacity: mood === "happy" || mood === "excited" ? 0.7 : 0.3 }}
          />
          
          {/* Right blush */}
          <motion.ellipse
            cx="75"
            cy="55"
            rx="8"
            ry="5"
            fill="url(#blush)"
            animate={{ opacity: mood === "happy" || mood === "excited" ? 0.7 : 0.3 }}
          />
          
          {/* Left eyebrow */}
          <motion.path
            d="M 28,35 Q 35,32 42,35"
            stroke="hsl(25, 40%, 30%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={{ 
              d: `M 28,${35 + config.eyebrows} Q 35,${32 + config.eyebrows} 42,35`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          
          {/* Right eyebrow */}
          <motion.path
            d="M 58,35 Q 65,32 72,35"
            stroke="hsl(25, 40%, 30%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={{ 
              d: `M 58,35 Q 65,${32 + config.eyebrows} 72,${35 + config.eyebrows}`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          
          {/* Left eye */}
          <motion.ellipse
            cx="35"
            cy="48"
            rx="6"
            ry="7"
            fill="hsl(25, 40%, 20%)"
            animate={{ 
              ry: 7 * config.eyeScale,
              rx: 6 * config.eyeScale
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          
          {/* Left eye shine */}
          <circle cx="37" cy="46" r="2" fill="white" opacity="0.9" />
          
          {/* Right eye */}
          <motion.ellipse
            cx="65"
            cy="48"
            rx="6"
            ry="7"
            fill="hsl(25, 40%, 20%)"
            animate={{ 
              ry: 7 * config.eyeScale,
              rx: 6 * config.eyeScale
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          
          {/* Right eye shine */}
          <circle cx="67" cy="46" r="2" fill="white" opacity="0.9" />
          
          {/* Mouth */}
          <motion.path
            d={config.mouth}
            stroke="hsl(25, 40%, 25%)"
            strokeWidth="3"
            strokeLinecap="round"
            fill={mood === "excited" ? "hsl(350, 60%, 45%)" : "none"}
            animate={{ d: config.mouth }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </svg>
        
        {/* Floating particles during analysis */}
        {isAnalyzing && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-primary/60"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 80],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 80],
                  opacity: [1, 0],
                  scale: [0, 1.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </motion.div>
      
      {/* Mood label */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.span
          className="px-6 py-2 rounded-full text-lg font-medium"
          style={{ 
            backgroundColor: `${config.color}20`,
            color: config.color,
          }}
          animate={{ backgroundColor: `${config.color}20`, color: config.color }}
          transition={{ duration: 0.5 }}
        >
          {moodLabels[mood]}
        </motion.span>
      </motion.div>
    </div>
  );
};
