import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { GardenBackground } from "./GardenBackground";
import { Plant, GrowthStage } from "./Plant";
import { X, Droplets, Sprout, Clock, Heart, TrendingUp } from "lucide-react";

interface GardenSceneProps {
  weatherMood: "sunny" | "cloudy" | "rainy" | "clearing";
  growthStage: GrowthStage;
  plantName?: string;
  seedType?: string;
  isAnalyzing?: boolean;
  isWatering?: boolean;
  waterGrowthPulse?: boolean;
  entryCount?: number;
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

// Forest-appropriate plant species with weighted variety
const plantTypePool: Array<"tallLeafy" | "roundBush" | "pine" | "fern" | "flowerPlant" | "willow" | "oakTree" | "birch"> = [
  "oakTree", "pine", "birch", "tallLeafy", "roundBush", "fern", "flowerPlant", "willow",
  "oakTree", "pine", "birch", "fern", // extra weight for forest staples
];

// Frog species for rainy weather
const frogSpecies = [
  { body: "hsl(120 45% 35%)", belly: "hsl(80 40% 55%)", spots: "hsl(130 50% 25%)", size: 1 },
  { body: "hsl(90 40% 40%)", belly: "hsl(60 45% 60%)", spots: "hsl(100 45% 30%)", size: 0.85 },
  { body: "hsl(140 35% 30%)", belly: "hsl(100 30% 50%)", spots: "hsl(150 40% 22%)", size: 1.1 },
  { body: "hsl(110 50% 38%)", belly: "hsl(70 40% 58%)", spots: "hsl(120 55% 28%)", size: 0.9 },
];

// Bird species
const birdSpecies = [
  { name: "robin", body: "hsl(15 60% 45%)", wing: "hsl(25 50% 35%)", size: 1 },
  { name: "bluebird", body: "hsl(210 70% 55%)", wing: "hsl(220 60% 45%)", size: 0.9 },
  { name: "sparrow", body: "hsl(30 40% 50%)", wing: "hsl(25 35% 40%)", size: 0.8 },
  { name: "goldfinch", body: "hsl(50 80% 55%)", wing: "hsl(0 0% 15%)", size: 0.85 },
  { name: "cardinal", body: "hsl(0 70% 50%)", wing: "hsl(0 60% 40%)", size: 1.1 },
];

// Seeded random for consistent but different plants
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

export const GardenScene = ({ 
  weatherMood, 
  growthStage, 
  plantName,
  seedType,
  isAnalyzing,
  isWatering,
  waterGrowthPulse,
  entryCount = 0,
}: GardenSceneProps) => {
  const [showPlantInfo, setShowPlantInfo] = useState(false);

  const storedSeedType = typeof window !== "undefined" ? localStorage.getItem("garden_seed_type") || "Hope" : "Hope";
  const resolvedSeedType = seedType || storedSeedType;
  const plantedDate = typeof window !== "undefined" ? localStorage.getItem("garden_seed_planted_date") : null;
  const age = plantedDate
    ? Math.max(1, Math.floor((Date.now() - new Date(plantedDate).getTime()) / 86400000))
    : 1;

  const [lastWatered, setLastWatered] = useState<number>(() => {
    const stored = localStorage.getItem("garden_last_watered");
    return stored ? parseInt(stored) : 0;
  });

  useEffect(() => {
    if (isWatering) {
      const now = Date.now();
      setLastWatered(now);
      localStorage.setItem("garden_last_watered", now.toString());
    }
  }, [isWatering]);

  const hoursSinceWatered = (Date.now() - lastWatered) / (1000 * 60 * 60);
  const isThirsty = !isWatering && hoursSinceWatered > 12 && weatherMood !== "rainy";

  // Generate randomized plants - ensure no adjacent duplicates and natural spacing
  const scenePlants = useMemo(() => {
    const pickUnique = (seed: number, avoid?: string) => {
      let type = plantTypePool[Math.floor(seededRandom(seed) * plantTypePool.length)];
      if (type === avoid) type = plantTypePool[Math.floor(seededRandom(seed + 99) * plantTypePool.length)];
      return type;
    };
    let lastLeft = "";
    const leftPlants = Array.from({ length: 6 }).map((_, i) => {
      const type = pickUnique(i * 3 + 1, lastLeft);
      lastLeft = type;
      return {
        type,
        x: 1 + i * 7 + seededRandom(i * 7) * 3,
        size: 0.7 + seededRandom(i * 11) * 0.8,
        delay: 0.1 + i * 0.12,
        flip: 1 as const,
      };
    });
    let lastRight = "";
    const rightPlants = Array.from({ length: 6 }).map((_, i) => {
      const type = pickUnique(i * 3 + 50, lastRight);
      lastRight = type;
      return {
        type,
        x: 58 + i * 7 + seededRandom(i * 7 + 50) * 3,
        size: 0.7 + seededRandom(i * 11 + 50) * 0.8,
        delay: 0.1 + i * 0.12,
        flip: -1 as const,
      };
    });
    return [...leftPlants, ...rightPlants];
  }, []);

  // Generate birds
  const birds = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      species: birdSpecies[i % birdSpecies.length],
      startX: -10 - i * 15,
      startY: 15 + seededRandom(i * 13) * 25,
      flyDuration: 18 + seededRandom(i * 7) * 20,
      delay: i * 8 + seededRandom(i * 9) * 10,
      sitsOnBranch: i < 2, // first 2 birds will sit on branches
      branchX: i === 0 ? 18 : 78,
      branchY: 38,
      sitDuration: 4 + seededRandom(i * 3) * 3,
    }));
  }, []);

  const stageNum = entryCount < 1 ? 0 : entryCount < 3 ? 1 : entryCount < 7 ? 2 : entryCount < 15 ? 3 : entryCount < 30 ? 4 : 5;
  const toBloom = Math.max(0, 15 - entryCount);

  return (
    <div className="relative w-full h-full min-h-[60vh]">
      <GardenBackground weatherMood={weatherMood} />
      
      {/* Randomized decorative vegetation */}
      {scenePlants.map((plant, i) => (
        <ScenePlant
          key={i}
          type={plant.type}
          x={plant.x}
          bottom="6.5rem"
          size={plant.size}
          delay={plant.delay}
          flip={plant.flip}
        />
      ))}

      {/* Flying Birds */}
      {birds.map((bird, i) => (
        <FlyingBird key={i} {...bird} />
      ))}

      {/* Frogs hopping in rain */}
      {weatherMood === "rainy" && (
        <>
          <HoppingFrog frog={frogSpecies[0]} startX={10} groundY={72} delay={0} />
          <HoppingFrog frog={frogSpecies[1]} startX={75} groundY={74} delay={3} />
          <HoppingFrog frog={frogSpecies[2]} startX={40} groundY={73} delay={6} />
          <HoppingFrog frog={frogSpecies[3]} startX={55} groundY={71} delay={9} />
        </>
      )}

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
        <motion.div
          className="relative cursor-pointer"
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowPlantInfo(true)}
        >
          <Plant stage={growthStage} name={plantName} seedType={seedType} />
          
          {/* Subtle ground highlight only */}
          {isWatering && (
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full"
              style={{ background: "hsl(200 50% 70% / 0.25)" }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Plant Info Card - shows on tap - now includes stage progress */}
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
              className="absolute left-1/2 bottom-[12rem] -translate-x-1/2 z-50 w-72"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="rounded-3xl backdrop-blur-xl bg-card/90 shadow-2xl border border-border/50 p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 rounded-t-3xl" />
                
                <button
                  onClick={(e) => { e.stopPropagation(); setShowPlantInfo(false); }}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plantName || "My Plant"}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sprout className="h-3 w-3" /> {resolvedSeedType} Seed · {stageLabels[growthStage]}
                    </p>
                  </div>

                  {/* Stage Progress */}
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-xs font-semibold text-foreground">
                        {entryCount === 0 ? "Start your journey" : `Stage ${stageNum} of 5`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(stageNum / 5) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {entryCount === 0 ? "Write your first entry 🌱" : toBloom > 0 ? `${toBloom} more entries to full bloom` : "In full bloom! 🌸"}
                    </p>
                  </div>

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
                left: `${15 + seededRandom(i * 17) * 70}%`,
                top: `${15 + seededRandom(i * 23) * 45}%`,
                width: 3 + seededRandom(i * 31) * 3,
                height: 3 + seededRandom(i * 31) * 3,
                background: `hsl(${45 + seededRandom(i * 41) * 15} 90% ${75 + seededRandom(i * 53) * 10}%)`,
              }}
              animate={{
                y: [0, -25, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 3 + seededRandom(i * 19) * 2,
                repeat: Infinity,
                delay: seededRandom(i * 29) * 2,
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
  willow: "Weeping Willow",
  oakTree: "Oak Tree",
  birch: "Silver Birch",
};

// Scene plant component with many varieties
const ScenePlant = ({ type, x, bottom, size, delay, flip }: {
  type: string;
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
              {plantNames[type] || "Wild Plant"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ transformOrigin: "bottom center" }}
        animate={tapped ? { scale: [1, 1.15, 0.95, 1.05, 1], rotate: [0, -5, 5, -3, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
      {type === "tallLeafy" && (
        <motion.svg
          width={50 * size} height={110 * size} viewBox="0 0 50 110"
          style={{ transform: `scaleX(${flip})`, transformOrigin: "bottom center" }}
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
          style={{ transform: `scaleX(${flip})`, transformOrigin: "bottom center" }}
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
          style={{ transform: `scaleX(${flip})`, transformOrigin: "bottom center" }}
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
          style={{ transform: `scaleX(${flip})`, transformOrigin: "bottom center" }}
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
          style={{ transform: `scaleX(${flip})`, transformOrigin: "bottom center" }}
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
      {type === "oakTree" && (
        <motion.svg
          width={50 * size} height={80 * size} viewBox="0 0 50 80"
          style={{ transform: `scaleX(${flip})`, transformOrigin: "bottom center" }}
          animate={{ rotate: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="21" y="50" width="8" height="30" fill="hsl(25 40% 28%)" rx="2" />
          <ellipse cx="25" cy="30" rx="22" ry="20" fill="hsl(125 42% 32%)" />
          <ellipse cx="18" cy="25" rx="12" ry="10" fill="hsl(130 45% 38%)" opacity="0.8" />
          <ellipse cx="32" cy="28" rx="10" ry="8" fill="hsl(128 40% 36%)" opacity="0.7" />
          <ellipse cx="25" cy="20" rx="8" ry="7" fill="hsl(132 48% 42%)" opacity="0.6" />
        </motion.svg>
      )}
      {type === "birch" && (
        <motion.svg
          width={25 * size} height={85 * size} viewBox="0 0 25 85"
          style={{ transform: `scaleX(${flip})`, transformOrigin: "bottom center" }}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="10" y="15" width="5" height="70" fill="hsl(40 10% 85%)" rx="2" />
          <rect x="10" y="30" width="5" height="2" fill="hsl(0 0% 25%)" opacity="0.4" />
          <rect x="10" y="50" width="5" height="1.5" fill="hsl(0 0% 25%)" opacity="0.3" />
          <ellipse cx="6" cy="22" rx="8" ry="6" fill="hsl(100 40% 50%)" transform="rotate(-20 6 22)" />
          <ellipse cx="19" cy="30" rx="7" ry="5" fill="hsl(105 42% 48%)" transform="rotate(15 19 30)" />
          <ellipse cx="8" cy="40" rx="6" ry="5" fill="hsl(95 38% 52%)" transform="rotate(-10 8 40)" />
        </motion.svg>
      )}
      {type === "willow" && (
        <motion.svg
          width={60 * size} height={100 * size} viewBox="0 0 60 100"
          style={{ transform: `scaleX(${flip})`, transformOrigin: "bottom center" }}
          animate={{ rotate: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M30 100 Q28 60 30 30" stroke="hsl(25 35% 32%)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="30" cy="25" rx="22" ry="16" fill="hsl(130 40% 38%)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.path
              key={i}
              d={`M${15 + i * 8} 28 Q${15 + i * 8 + (i % 2 ? 3 : -3)} 55 ${15 + i * 8 + (i % 2 ? 6 : -6)} 75`}
              stroke="hsl(128 45% 42%)"
              strokeWidth="1.5"
              fill="none"
              animate={{ d: [
                `M${15 + i * 8} 28 Q${15 + i * 8 + 3} 55 ${15 + i * 8 + 6} 75`,
                `M${15 + i * 8} 28 Q${15 + i * 8 - 3} 55 ${15 + i * 8 - 6} 75`,
                `M${15 + i * 8} 28 Q${15 + i * 8 + 3} 55 ${15 + i * 8 + 6} 75`,
              ]}}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.svg>
      )}
      </motion.div>
    </motion.div>
  );
};

// Flying bird component - simplified to avoid getting stuck
const FlyingBird = ({ species, startY, flyDuration, delay }: {
  species: typeof birdSpecies[number];
  startX: number;
  startY: number;
  flyDuration: number;
  delay: number;
  sitsOnBranch: boolean;
  branchX: number;
  branchY: number;
  sitDuration: number;
}) => {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      style={{ top: `${startY}%` }}
      initial={{ left: "-10%", opacity: 0 }}
      animate={{
        left: ["-10%", "110%"],
        y: [0, -25, 15, -20, 0],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        duration: flyDuration,
        delay,
        repeat: Infinity,
        repeatDelay: 10 + delay * 2,
        ease: "linear",
      }}
    >
      <motion.svg
        width={22 * species.size}
        height={18 * species.size}
        viewBox="0 0 22 18"
      >
        <ellipse cx="11" cy="10" rx="5" ry="4" fill={species.body} />
        <circle cx="16" cy="8" r="2.5" fill={species.body} />
        <circle cx="17" cy="7" r="0.8" fill="hsl(0 0% 10%)" />
        <polygon points="19,8 22,7 19,8.5" fill="hsl(35 70% 50%)" />
        <motion.path
          d="M8 8 Q5 2 2 6"
          stroke={species.wing}
          strokeWidth="1.5"
          fill={species.wing}
          animate={{
            d: [
              "M8 8 Q5 2 2 6",
              "M8 8 Q5 12 2 10",
              "M8 8 Q5 2 2 6",
            ],
          }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        <motion.path
          d="M14 8 Q17 2 20 6"
          stroke={species.wing}
          strokeWidth="1.5"
          fill={species.wing}
          animate={{
            d: [
              "M14 8 Q17 2 20 6",
              "M14 8 Q17 12 20 10",
              "M14 8 Q17 2 20 6",
            ],
          }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </motion.svg>
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

// Hopping frog component for rainy weather
const HoppingFrog = ({ frog, startX, groundY, delay }: {
  frog: typeof frogSpecies[number];
  startX: number;
  groundY: number;
  delay: number;
}) => {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      style={{ top: `${groundY}%`, left: `${startX}%` }}
      animate={{
        x: [0, 60, 30, 90, -20, 50, 0],
        y: [0, -35, 0, -40, 0, -30, 0],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "easeInOut",
        times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
      }}
    >
      <motion.svg
        width={28 * frog.size}
        height={22 * frog.size}
        viewBox="0 0 28 22"
      >
        {/* Body */}
        <ellipse cx="14" cy="14" rx="10" ry="7" fill={frog.body} />
        {/* Belly */}
        <ellipse cx="14" cy="16" rx="7" ry="4" fill={frog.belly} opacity="0.6" />
        {/* Head */}
        <ellipse cx="14" cy="8" rx="7" ry="5.5" fill={frog.body} />
        {/* Eyes - big bulging frog eyes */}
        <circle cx="9" cy="4" r="3" fill="hsl(60 80% 85%)" />
        <circle cx="19" cy="4" r="3" fill="hsl(60 80% 85%)" />
        <circle cx="9" cy="4" r="1.5" fill="hsl(0 0% 10%)" />
        <circle cx="19" cy="4" r="1.5" fill="hsl(0 0% 10%)" />
        {/* Spots */}
        <circle cx="11" cy="12" r="1.5" fill={frog.spots} opacity="0.5" />
        <circle cx="17" cy="13" r="1.2" fill={frog.spots} opacity="0.4" />
        {/* Mouth line */}
        <path d="M8 9 Q14 12 20 9" stroke={frog.spots} strokeWidth="0.5" fill="none" opacity="0.4" />
        {/* Front legs */}
        <motion.path
          d="M6 16 Q3 18 4 20"
          stroke={frog.body}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ["M6 16 Q3 18 4 20", "M6 16 Q2 14 3 18", "M6 16 Q3 18 4 20"] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        <motion.path
          d="M22 16 Q25 18 24 20"
          stroke={frog.body}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ["M22 16 Q25 18 24 20", "M22 16 Q26 14 25 18", "M22 16 Q25 18 24 20"] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        {/* Back legs */}
        <motion.path
          d="M7 18 Q2 20 1 22"
          stroke={frog.body}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ["M7 18 Q2 20 1 22", "M7 18 Q0 15 2 19", "M7 18 Q2 20 1 22"] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        <motion.path
          d="M21 18 Q26 20 27 22"
          stroke={frog.body}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ["M21 18 Q26 20 27 22", "M21 18 Q28 15 26 19", "M21 18 Q26 20 27 22"] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      </motion.svg>
    </motion.div>
  );
};
