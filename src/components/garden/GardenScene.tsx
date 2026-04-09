import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GardenBackground } from "./GardenBackground";
import { Plant, GrowthStage } from "./Plant";
import { X, Droplets, Sprout, Clock, Heart } from "lucide-react";

interface GardenSceneProps {
  weatherMood: "sunny" | "cloudy" | "rainy" | "clearing";
  growthStage: GrowthStage;
  plantName?: string;
  seedType?: string;
  isAnalyzing?: boolean;
  isWatering?: boolean;
  waterGrowthPulse?: boolean;
}

const stageLabels: Record<GrowthStage, string> = {
  seed: "Seedling",
  rooted: "Taking Root",
  sprouting: "Sprouting",
  growing: "Growing Strong",
  blooming: "In Full Bloom",
};

const stageFeeling: Record<GrowthStage, string> = {
  seed: "Curious & hopeful 🌱",
  rooted: "Settling in nicely 😊",
  sprouting: "Feeling energized! 💪",
  growing: "Thriving & happy 🌿",
  blooming: "Absolutely radiant! 🌸",
};

// Pre-computed water droplet data for smooth animation
const waterDroplets = Array.from({ length: 14 }).map((_, i) => ({
  x: 44 + (i * 5.3 % 12),
  w: 2 + (i * 3 % 3),
  h: 8 + (i * 5 % 6),
  driftX: (i % 2 === 0 ? 1 : -1) * (2 + (i * 3 % 8)),
  duration: 0.7 + (i * 7 % 5) * 0.1,
  delay: (i * 0.1) % 1.0,
}));

const waterSplashes = Array.from({ length: 4 }).map((_, i) => ({
  x: 46 + (i * 5 % 8),
  size: 8 + (i * 4 % 6),
  delay: 0.4 + i * 0.2,
  repeatDelay: 0.6 + (i * 3 % 5) * 0.12,
}));

export const GardenScene = ({ 
  weatherMood, 
  growthStage, 
  plantName,
  seedType,
  isAnalyzing,
  isWatering,
  waterGrowthPulse
}: GardenSceneProps) => {
  const [showPlantInfo, setShowPlantInfo] = useState(false);

  const storedSeedType = typeof window !== "undefined" ? localStorage.getItem("garden_seed_type") || "Hope" : "Hope";
  const resolvedSeedType = seedType || storedSeedType;
  const plantedDate = typeof window !== "undefined" ? localStorage.getItem("garden_seed_planted_date") : null;
  const age = plantedDate
    ? Math.max(1, Math.floor((Date.now() - new Date(plantedDate).getTime()) / 86400000))
    : 1;
  // Track last watered time to avoid showing thirsty right after watering
  const [lastWatered, setLastWatered] = useState<number>(() => {
    const stored = localStorage.getItem("garden_last_watered");
    return stored ? parseInt(stored) : 0;
  });

  // Update lastWatered when watering starts
  useEffect(() => {
    if (isWatering) {
      const now = Date.now();
      setLastWatered(now);
      localStorage.setItem("garden_last_watered", now.toString());
    }
  }, [isWatering]);

  const hoursSinceWatered = (Date.now() - lastWatered) / (1000 * 60 * 60);
  const isThirsty = !isWatering && hoursSinceWatered > 12 && weatherMood !== "rainy";

  return (
    <div className="relative w-full h-full min-h-[60vh]">
      <GardenBackground weatherMood={weatherMood} />
      
      {/* Spread-out decorative vegetation across the full width */}
      {/* Far left */}
      <ScenePlant type="tallLeafy" x={2} bottom="7rem" size={1.6} delay={0.2} flip={1} />
      <ScenePlant type="roundBush" x={8} bottom="6.5rem" size={1.2} delay={0.4} flip={1} />
      {/* Left-center */}
      <ScenePlant type="pine" x={18} bottom="7rem" size={1.0} delay={0.5} flip={1} />
      <ScenePlant type="fern" x={24} bottom="6.5rem" size={1.1} delay={0.7} flip={1} />
      {/* Center-left */}
      <ScenePlant type="flowerPlant" x={33} bottom="6.8rem" size={0.9} delay={0.3} flip={1} />
      
      {/* Center-right */}
      <ScenePlant type="flowerPlant" x={65} bottom="6.8rem" size={0.9} delay={0.4} flip={-1} />
      {/* Right-center */}
      <ScenePlant type="fern" x={72} bottom="6.5rem" size={1.1} delay={0.6} flip={-1} />
      <ScenePlant type="pine" x={78} bottom="7rem" size={1.0} delay={0.5} flip={-1} />
      {/* Far right */}
      <ScenePlant type="roundBush" x={86} bottom="6.5rem" size={1.2} delay={0.3} flip={-1} />
      <ScenePlant type="tallLeafy" x={92} bottom="7rem" size={1.6} delay={0.2} flip={-1} />

      {/* Water droplets when watering */}
      <AnimatePresence>
        {isWatering && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {waterDroplets.map((drop, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${drop.x}%`,
                  background: `linear-gradient(180deg, hsl(200 85% 78% / 0.95), hsl(210 90% 68% / 0.8))`,
                  width: drop.w,
                  height: drop.h,
                  borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
                  filter: "blur(0.3px)",
                }}
                initial={{ top: "40%", opacity: 0, scale: 0.3 }}
                animate={{
                  top: ["40%", "68%"],
                  opacity: [0, 0.9, 0.9, 0.4, 0],
                  scale: [0.3, 1, 0.9, 0.6],
                  x: [drop.driftX * 0.3, drop.driftX],
                }}
                transition={{
                  duration: drop.duration,
                  delay: drop.delay,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            ))}
            {/* Splash ripples at ground level */}
            {waterSplashes.map((splash, i) => (
              <motion.div
                key={`splash-${i}`}
                className="absolute rounded-full border"
                style={{
                  left: `${splash.x}%`,
                  top: "69%",
                  borderColor: "hsl(200 70% 75% / 0.4)",
                }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{
                  width: [0, splash.size, splash.size * 1.5],
                  height: [0, splash.size * 0.4, splash.size * 0.3],
                  opacity: [0, 0.6, 0],
                  x: [-splash.size * 0.5, -splash.size * 0.75],
                }}
                transition={{
                  duration: 0.6,
                  delay: splash.delay,
                  repeat: Infinity,
                  repeatDelay: splash.repeatDelay,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plant positioned on the ground layer */}
      <motion.div
        className="absolute bottom-[5.5rem] left-0 right-0 flex justify-center z-10"
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
        {/* Clickable Plant Container */}
        <motion.div
          className="relative cursor-pointer"
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowPlantInfo(true)}
        >
          <Plant stage={growthStage} name={plantName} seedType={seedType} />
          
          {/* Subtle breathing aura - no ring */}
          <motion.div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${
                weatherMood === "sunny" ? "hsl(45 100% 70% / 0.15)" :
                weatherMood === "rainy" ? "hsl(200 80% 60% / 0.1)" :
                weatherMood === "clearing" ? "hsl(170 60% 65% / 0.15)" :
                "hsl(210 40% 70% / 0.1)"
              } 0%, transparent 70%)`,
              transform: "scale(2.5)",
            }}
            animate={{
              scale: [2, 2.5, 2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        
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
        
        {/* Growth pulse glow */}
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

      {/* Plant Info Card - shows on tap */}
      <AnimatePresence>
        {showPlantInfo && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlantInfo(false)}
            />
            <motion.div
              className="absolute left-1/2 bottom-[12rem] -translate-x-1/2 z-50 w-64"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="rounded-3xl backdrop-blur-xl bg-card/90 shadow-2xl border border-border/50 p-4 relative overflow-hidden">
                {/* Decorative top gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 rounded-t-3xl" />
                
                <button
                  onClick={(e) => { e.stopPropagation(); setShowPlantInfo(false); }}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="space-y-3">
                  {/* Name & Type */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plantName || "My Plant"}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sprout className="h-3 w-3" /> {resolvedSeedType} Seed · {stageLabels[growthStage]}
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-muted/40 p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">Age</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{age} {age === 1 ? "day" : "days"}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/40 p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Droplets className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-xs text-muted-foreground">Thirst</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{isThirsty ? "Thirsty 💧" : "Hydrated ✅"}</p>
                    </div>
                  </div>

                  {/* Feeling */}
                  <div className="rounded-2xl bg-muted/40 p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Heart className="h-3.5 w-3.5 text-rose-400" />
                      <span className="text-xs text-muted-foreground">Feeling</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{stageFeeling[growthStage]}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

// Plant names by type
const plantNames: Record<string, string> = {
  tallLeafy: "Fern Willow",
  roundBush: "Berry Bush",
  pine: "Little Pine",
  fern: "Wild Fern",
  flowerPlant: "Meadow Bloom",
};

// Unified scene plant component with multiple varieties - now interactive
const ScenePlant = ({ type, x, bottom, size, delay, flip }: {
  type: "tallLeafy" | "roundBush" | "pine" | "fern" | "flowerPlant";
  x: number;
  bottom: string;
  size: number;
  delay: number;
  flip: number;
}) => {
  const [tapped, setTapped] = useState(false);

  return (
    <motion.div
      className="absolute z-[5] cursor-pointer"
      style={{ left: `${x}%`, bottom }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => { setTapped(true); setTimeout(() => setTapped(false), 1800); }}
    >
      {/* Name tooltip */}
      <AnimatePresence>
        {tapped && (
          <motion.div
            className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-50"
            initial={{ opacity: 0, y: 5, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-card/90 backdrop-blur-sm shadow-md text-foreground border border-border/30">
              {plantNames[type]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={tapped ? { scale: [1, 1.15, 0.95, 1.05, 1], rotate: [0, -5, 5, -3, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
      {type === "tallLeafy" && (
        <motion.svg
          width={50 * size} height={110 * size} viewBox="0 0 50 110"
          style={{ transform: `scaleX(${flip})` }}
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M25 110 Q23 70 25 20" stroke="hsl(125 45% 30%)" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="13" cy="70" rx="12" ry="7" fill="hsl(130 52% 36%)" transform="rotate(-35 13 70)" />
          <ellipse cx="37" cy="58" rx="13" ry="7" fill="hsl(128 50% 38%)" transform="rotate(30 37 58)" />
          <ellipse cx="15" cy="42" rx="11" ry="6" fill="hsl(132 55% 40%)" transform="rotate(-28 15 42)" />
          <ellipse cx="35" cy="28" rx="10" ry="6" fill="hsl(135 58% 43%)" transform="rotate(22 35 28)" />
          <ellipse cx="25" cy="16" rx="9" ry="7" fill="hsl(138 55% 45%)" />
        </motion.svg>
      )}
      {type === "roundBush" && (
        <motion.svg
          width={55 * size} height={45 * size} viewBox="0 0 55 45"
          style={{ transform: `scaleX(${flip})` }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="14" cy="35" rx="13" ry="10" fill="hsl(130 45% 30%)" />
          <ellipse cx="42" cy="36" rx="12" ry="9" fill="hsl(128 42% 33%)" />
          <ellipse cx="28" cy="24" rx="20" ry="16" fill="hsl(132 50% 36%)" />
          <ellipse cx="22" cy="18" rx="10" ry="8" fill="hsl(135 52% 40%)" opacity="0.8" />
          <ellipse cx="34" cy="20" rx="8" ry="6" fill="hsl(138 48% 42%)" opacity="0.6" />
        </motion.svg>
      )}
      {type === "pine" && (
        <motion.svg
          width={30 * size} height={65 * size} viewBox="0 0 30 65"
          style={{ transform: `scaleX(${flip})` }}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="13" y="48" width="4" height="17" fill="hsl(25 42% 30%)" />
          <polygon points="15,5 2,50 28,50" fill="hsl(140 42% 30%)" />
          <polygon points="15,15 5,45 25,45" fill="hsl(135 38% 36%)" opacity="0.8" />
        </motion.svg>
      )}
      {type === "fern" && (
        <motion.svg
          width={35 * size} height={50 * size} viewBox="0 0 40 50"
          style={{ transform: `scaleX(${flip})` }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {[-20, -10, 0, 10, 20].map((angle, i) => (
            <motion.path
              key={i}
              d={`M20 50 Q${20 + angle * 0.5} 28 ${20 + angle} ${8 + Math.abs(angle) * 0.3}`}
              stroke={`hsl(${130 + i * 3} ${45 + i * 2}% ${35 + i * 3}%)`}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </motion.svg>
      )}
      {type === "flowerPlant" && (
        <motion.svg
          width={35 * size} height={65 * size} viewBox="0 0 40 70"
          style={{ transform: `scaleX(${flip})` }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M20 70 Q18 48 20 22" stroke="hsl(125 45% 33%)" strokeWidth="3" fill="none" />
          <ellipse cx="12" cy="52" rx="8" ry="4" fill="hsl(130 50% 38%)" transform="rotate(-35 12 52)" />
          <ellipse cx="28" cy="44" rx="7" ry="4" fill="hsl(132 48% 40%)" transform="rotate(30 28 44)" />
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <motion.ellipse
              key={i} cx="20" cy="14" rx="5" ry="9"
              fill={`hsl(${340 + i * 12} 65% ${72 + i * 2}%)`}
              transform={`rotate(${angle} 20 18)`}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          <circle cx="20" cy="18" r="4" fill="hsl(45 90% 60%)" />
        </motion.svg>
      )}
      </motion.div>
    </motion.div>
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
      <motion.ellipse cx="6" cy="10" rx="5" ry="8" fill="hsl(280 60% 70%)" animate={{ rx: [5, 2, 5] }} transition={{ duration: 0.2, repeat: Infinity }} />
      <motion.ellipse cx="18" cy="10" rx="5" ry="8" fill="hsl(280 60% 70%)" animate={{ rx: [5, 2, 5] }} transition={{ duration: 0.2, repeat: Infinity }} />
      <ellipse cx="12" cy="10" rx="2" ry="6" fill="hsl(30 40% 25%)" />
      <circle cx="6" cy="8" r="2" fill="hsl(320 70% 80%)" opacity="0.7" />
      <circle cx="18" cy="8" r="2" fill="hsl(320 70% 80%)" opacity="0.7" />
    </motion.svg>
  </motion.div>
);
