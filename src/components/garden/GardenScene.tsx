import { motion } from "framer-motion";
import { GardenBackground } from "./GardenBackground";
import { Plant, GrowthStage } from "./Plant";

interface GardenSceneProps {
  weatherMood: "sunny" | "cloudy" | "rainy" | "clearing";
  growthStage: GrowthStage;
  plantName?: string;
  isAnalyzing?: boolean;
}

export const GardenScene = ({ 
  weatherMood, 
  growthStage, 
  plantName,
  isAnalyzing 
}: GardenSceneProps) => {
  return (
    <div className="relative w-full h-full min-h-[60vh]">
      <GardenBackground weatherMood={weatherMood} />
      
      {/* Plant positioned at center-bottom */}
      <motion.div
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isAnalyzing ? [1, 1.02, 1] : 1,
        }}
        transition={{ 
          duration: 0.8,
          scale: { duration: 1, repeat: isAnalyzing ? Infinity : 0 }
        }}
      >
        <Plant stage={growthStage} name={plantName} />
      </motion.div>

      {/* Subtle particles for magic feel */}
      {weatherMood === "sunny" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 40}%`,
                background: "hsl(50 90% 80% / 0.6)",
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8],
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
    </div>
  );
};
