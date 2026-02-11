import { motion } from "framer-motion";
import { GardenBackground } from "./GardenBackground";
import { Plant, GrowthStage } from "./Plant";

interface GardenSceneProps {
  weatherMood: "sunny" | "cloudy" | "rainy" | "clearing";
  growthStage: GrowthStage;
  plantName?: string;
  isAnalyzing?: boolean;
  isWatering?: boolean;
  waterGrowthPulse?: boolean;
}

export const GardenScene = ({ 
  weatherMood, 
  growthStage, 
  plantName,
  isAnalyzing,
  isWatering,
  waterGrowthPulse
}: GardenSceneProps) => {
  return (
    <div className="relative w-full h-full min-h-[60vh]">
      <GardenBackground weatherMood={weatherMood} />
      
      {/* Decorative side plants - Left */}
      <motion.div
        className="absolute bottom-24 left-4 z-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SidePlant variant="tall" direction="left" />
      </motion.div>
      <motion.div
        className="absolute bottom-28 left-12 z-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SidePlant variant="bush" direction="left" />
      </motion.div>
      
      {/* Decorative side plants - Right */}
      <motion.div
        className="absolute bottom-24 right-4 z-5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SidePlant variant="tall" direction="right" />
      </motion.div>
      <motion.div
        className="absolute bottom-28 right-12 z-5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <SidePlant variant="flower" direction="right" />
      </motion.div>

      {/* Water droplets when watering */}
      {isWatering && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${35 + Math.random() * 30}%`,
                background: `linear-gradient(180deg, hsl(200 80% 75% / 0.9), hsl(210 90% 65% / 0.7))`,
                width: 3 + Math.random() * 4,
                height: 8 + Math.random() * 8,
                borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
              }}
              initial={{ top: "15%", opacity: 0, scale: 0.5 }}
              animate={{
                top: ["15%", "75%"],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 0.8],
                x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                delay: Math.random() * 1.5,
                repeat: 2,
                ease: "easeIn",
              }}
            />
          ))}
          
          {/* Splash effects at bottom */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`splash-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${40 + Math.random() * 20}%`,
                bottom: "25%",
                width: 4,
                height: 4,
                background: "hsl(200 80% 70%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                y: [0, -20 - Math.random() * 20],
                x: [(Math.random() - 0.5) * 30],
              }}
              transition={{
                duration: 0.6,
                delay: 0.8 + Math.random() * 1.5,
                repeat: 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Plant positioned at center-bottom, grounded on soil */}
      <motion.div
        className="absolute bottom-[6.5rem] left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: waterGrowthPulse 
            ? [1, 1.08, 1.04, 1.06, 1] 
            : isAnalyzing ? [1, 1.02, 1] 
            : isWatering ? [1, 1.03, 1] : 1,
        }}
        transition={{ 
          duration: 0.8,
          scale: { duration: waterGrowthPulse ? 1.5 : 1, repeat: (isAnalyzing || isWatering) && !waterGrowthPulse ? Infinity : 0 }
        }}
      >
        <Plant stage={growthStage} name={plantName} />
        
        {/* Glow effect when watering */}
        {isWatering && (
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(circle, hsl(200 70% 60% / 0.3) 0%, transparent 70%)",
              transform: "scale(2)",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        
        {/* Growth pulse glow when water reaches plant */}
        {waterGrowthPulse && (
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [1, 2.5, 3],
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              background: "radial-gradient(circle, hsl(120 70% 55% / 0.5) 0%, hsl(50 80% 60% / 0.3) 40%, transparent 70%)",
            }}
          />
        )}
        
        {/* Sparkle particles on growth */}
        {waterGrowthPulse && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`growth-sparkle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              background: "hsl(50 100% 70%)",
              left: "50%",
              top: "50%",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              x: Math.cos(i * Math.PI / 4) * 50,
              y: Math.sin(i * Math.PI / 4) * 50,
            }}
            transition={{ duration: 1, delay: i * 0.05 }}
          />
        ))}
      </motion.div>

      {/* Subtle particles for magic feel */}
      {weatherMood === "sunny" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 45}%`,
                width: 3 + Math.random() * 3,
                height: 3 + Math.random() * 3,
                background: `hsl(${45 + Math.random() * 15} 90% ${75 + Math.random() * 10}%)`,
              }}
              animate={{
                y: [0, -25, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Butterflies */}
      {weatherMood === "sunny" && (
        <>
          <Butterfly x={20} y={30} delay={0} />
          <Butterfly x={75} y={25} delay={2} />
        </>
      )}
    </div>
  );
};

// Side decorative plants
const SidePlant = ({ variant, direction }: { variant: "tall" | "bush" | "flower"; direction: "left" | "right" }) => {
  const flip = direction === "right" ? -1 : 1;
  
  if (variant === "tall") {
    return (
      <motion.svg
        width="45"
        height="90"
        viewBox="0 0 45 90"
        style={{ transform: `scaleX(${flip})` }}
        animate={{ rotate: [-2 * flip, 2 * flip, -2 * flip] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Stem */}
        <motion.path
          d="M22 90 Q20 60 22 20"
          stroke="hsl(125 45% 32%)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ["M22 90 Q20 60 22 20", "M22 90 Q24 60 22 20", "M22 90 Q20 60 22 20"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Leaves */}
        <motion.ellipse cx="12" cy="55" rx="10" ry="6" fill="hsl(130 50% 38%)" transform="rotate(-30 12 55)" />
        <motion.ellipse cx="32" cy="45" rx="11" ry="6" fill="hsl(128 48% 40%)" transform="rotate(25 32 45)" />
        <motion.ellipse cx="14" cy="32" rx="9" ry="5" fill="hsl(132 52% 42%)" transform="rotate(-25 14 32)" />
        <motion.ellipse cx="28" cy="22" rx="8" ry="5" fill="hsl(135 55% 45%)" transform="rotate(20 28 22)" />
      </motion.svg>
    );
  }
  
  if (variant === "bush") {
    return (
      <motion.svg
        width="55"
        height="50"
        viewBox="0 0 55 50"
        style={{ transform: `scaleX(${flip})` }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="15" cy="38" rx="14" ry="12" fill="hsl(130 42% 32%)" />
        <ellipse cx="40" cy="40" rx="12" ry="10" fill="hsl(128 40% 35%)" />
        <ellipse cx="28" cy="28" rx="18" ry="16" fill="hsl(132 48% 38%)" />
        <ellipse cx="22" cy="22" rx="10" ry="8" fill="hsl(135 50% 42%)" opacity="0.8" />
      </motion.svg>
    );
  }
  
  // Flower variant
  return (
    <motion.svg
      width="40"
      height="70"
      viewBox="0 0 40 70"
      style={{ transform: `scaleX(${flip})` }}
      animate={{ rotate: [-3 * flip, 3 * flip, -3 * flip] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Stem */}
      <path d="M20 70 Q18 50 20 25" stroke="hsl(125 45% 35%)" strokeWidth="3" fill="none" />
      {/* Leaves */}
      <ellipse cx="12" cy="50" rx="8" ry="4" fill="hsl(130 50% 40%)" transform="rotate(-35 12 50)" />
      <ellipse cx="28" cy="42" rx="7" ry="4" fill="hsl(132 48% 42%)" transform="rotate(30 28 42)" />
      {/* Flower petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <motion.ellipse
          key={i}
          cx="20"
          cy="15"
          rx="6"
          ry="10"
          fill={`hsl(${320 + i * 10} 65% ${70 + i * 3}%)`}
          transform={`rotate(${angle} 20 20)`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      {/* Center */}
      <circle cx="20" cy="20" r="5" fill="hsl(45 90% 60%)" />
    </motion.svg>
  );
};

// Butterfly component
const Butterfly = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
  <motion.div
    className="absolute pointer-events-none z-20"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      x: [0, 50, -30, 20, 0],
      y: [0, -20, 10, -15, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    <motion.svg
      width="24"
      height="20"
      viewBox="0 0 24 20"
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 0.3, repeat: Infinity }}
    >
      {/* Wings */}
      <motion.ellipse
        cx="6"
        cy="10"
        rx="5"
        ry="8"
        fill="hsl(280 60% 70%)"
        animate={{ rx: [5, 2, 5] }}
        transition={{ duration: 0.2, repeat: Infinity }}
      />
      <motion.ellipse
        cx="18"
        cy="10"
        rx="5"
        ry="8"
        fill="hsl(280 60% 70%)"
        animate={{ rx: [5, 2, 5] }}
        transition={{ duration: 0.2, repeat: Infinity }}
      />
      {/* Body */}
      <ellipse cx="12" cy="10" rx="2" ry="6" fill="hsl(30 40% 25%)" />
      {/* Wing patterns */}
      <circle cx="6" cy="8" r="2" fill="hsl(320 70% 80%)" opacity="0.7" />
      <circle cx="18" cy="8" r="2" fill="hsl(320 70% 80%)" opacity="0.7" />
    </motion.svg>
  </motion.div>
);
