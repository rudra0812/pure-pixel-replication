import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SeedOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const seedOptions: SeedOption[] = [
  {
    id: "hope",
    name: "Seed of Hope",
    emoji: "🌱",
    color: "hsl(140 60% 45%)",
    description: "Grows into a resilient flower",
  },
  {
    id: "peace",
    name: "Seed of Peace",
    emoji: "🌿",
    color: "hsl(160 50% 40%)",
    description: "Blooms with calming leaves",
  },
  {
    id: "joy",
    name: "Seed of Joy",
    emoji: "🌻",
    color: "hsl(45 90% 55%)",
    description: "Radiates warmth and happiness",
  },
  {
    id: "growth",
    name: "Seed of Growth",
    emoji: "🌳",
    color: "hsl(130 45% 35%)",
    description: "Becomes a mighty tree",
  },
];

interface SeedPlantingOnboardingProps {
  onComplete: (seedType: string, seedName: string) => void;
}

type Step = "select" | "name" | "plant";

export const SeedPlantingOnboarding = ({ onComplete }: SeedPlantingOnboardingProps) => {
  const [step, setStep] = useState<Step>("select");
  const [selectedSeed, setSelectedSeed] = useState<SeedOption | null>(null);
  const [seedName, setSeedName] = useState("");
  const [isPlanting, setIsPlanting] = useState(false);

  const handleSelectSeed = (seed: SeedOption) => {
    setSelectedSeed(seed);
    setTimeout(() => setStep("name"), 300);
  };

  const handleNameSeed = () => {
    if (seedName.trim()) {
      setStep("plant");
    }
  };

  const handlePlant = async () => {
    setIsPlanting(true);
    // Wait for planting animation
    await new Promise(resolve => setTimeout(resolve, 4000));
    onComplete(selectedSeed!.id, seedName);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated garden background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsl(200 75% 65%) 0%, hsl(190 65% 75%) 40%, hsl(45 70% 82%) 100%)",
          }}
          animate={{
            background: isPlanting 
              ? "linear-gradient(180deg, hsl(200 85% 60%) 0%, hsl(180 70% 70%) 40%, hsl(130 50% 70%) 100%)"
              : "linear-gradient(180deg, hsl(200 75% 65%) 0%, hsl(190 65% 75%) 40%, hsl(45 70% 82%) 100%)",
          }}
          transition={{ duration: 2 }}
        />

        {/* Animated clouds */}
        {[
          { left: "5%", top: "8%", size: 120, speed: 25 },
          { left: "30%", top: "5%", size: 100, speed: 30 },
          { left: "60%", top: "10%", size: 110, speed: 28 },
          { left: "85%", top: "6%", size: 90, speed: 35 },
        ].map((cloud, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: cloud.left, top: cloud.top, width: cloud.size, height: cloud.size * 0.4 }}
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: cloud.speed, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <ellipse cx="25" cy="28" rx="20" ry="12" fill="hsl(0 0% 98% / 0.85)" />
              <ellipse cx="50" cy="20" rx="28" ry="16" fill="hsl(0 0% 100% / 0.9)" />
              <ellipse cx="75" cy="26" rx="22" ry="14" fill="hsl(0 0% 97% / 0.85)" />
            </svg>
          </motion.div>
        ))}

        {/* Distant hills */}
        <div className="absolute bottom-32 left-0 right-0 h-24">
          <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 60 Q80 20 160 40 T320 25 T400 35 L400 60 Z" fill="hsl(145 35% 50%)" opacity="0.5" />
            <path d="M0 60 Q60 35 130 48 T270 38 T400 50 L400 60 Z" fill="hsl(140 40% 42%)" opacity="0.7" />
          </svg>
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, hsl(125 50% 42%) 0%, hsl(120 45% 35%) 40%, hsl(30 50% 28%) 100%)",
            }}
          />
          {/* Grass */}
          <svg viewBox="0 0 400 30" className="absolute top-0 left-0 w-full h-8" preserveAspectRatio="none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.path
                key={i}
                d={`M${i * 8 + 2} 30 Q${i * 8 + 4} ${12 + Math.random() * 8} ${i * 8 + 6} 30`}
                fill="none"
                stroke={`hsl(${125 + Math.random() * 10} ${45 + Math.random() * 10}% ${35 + Math.random() * 8}%)`}
                strokeWidth="1.5"
                animate={{ 
                  d: [
                    `M${i * 8 + 2} 30 Q${i * 8 + 4} ${12 + Math.random() * 8} ${i * 8 + 6} 30`,
                    `M${i * 8 + 2} 30 Q${i * 8 + 5} ${10 + Math.random() * 8} ${i * 8 + 6} 30`,
                    `M${i * 8 + 2} 30 Q${i * 8 + 4} ${12 + Math.random() * 8} ${i * 8 + 6} 30`,
                  ]
                }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity }}
              />
            ))}
          </svg>
        </div>

        {/* Magic particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${20 + Math.random() * 50}%`,
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              background: `hsl(${40 + Math.random() * 30} 80% 75%)`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Seed */}
        {step === "select" && (
          <motion.div
            key="select"
            className="relative z-10 px-6 w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-2xl font-bold text-center mb-2 text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Choose Your Seed
            </motion.h1>
            <motion.p
              className="text-center text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              This seed will grow with your journaling journey
            </motion.p>

            <div className="grid grid-cols-2 gap-4">
              {seedOptions.map((seed, index) => (
                <motion.button
                  key={seed.id}
                  className="relative p-4 rounded-2xl bg-card/85 backdrop-blur-md border-2 border-transparent hover:border-primary/50 transition-all shadow-lg"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectSeed(seed)}
                >
                  <motion.div
                    className="text-4xl mb-2"
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{ 
                      duration: 2 + index * 0.3, 
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {seed.emoji}
                  </motion.div>
                  <p className="font-medium text-sm text-foreground">{seed.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{seed.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Name Seed */}
        {step === "name" && selectedSeed && (
          <motion.div
            key="name"
            className="relative z-10 px-6 w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-6xl text-center mb-6"
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [-5, 5, -5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {selectedSeed.emoji}
            </motion.div>

            <motion.h1
              className="text-2xl font-bold text-center mb-2 text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Name Your {selectedSeed.name}
            </motion.h1>
            <motion.p
              className="text-center text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Give your seed a personal name
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Input
                value={seedName}
                onChange={(e) => setSeedName(e.target.value)}
                placeholder="e.g., My Journey, Hope Garden..."
                className="h-14 text-lg text-center rounded-2xl bg-card/85 backdrop-blur-md border-border/50"
                autoFocus
              />
              <Button
                onClick={handleNameSeed}
                disabled={!seedName.trim()}
                className="w-full h-14 text-lg rounded-2xl shadow-lg"
                style={{
                  background: seedName.trim() 
                    ? "linear-gradient(135deg, hsl(130 50% 40%), hsl(140 45% 35%))"
                    : undefined,
                }}
              >
                Continue
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Enhanced Plant Animation */}
        {step === "plant" && selectedSeed && (
          <motion.div
            key="plant"
            className="relative z-10 w-full h-full flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {!isPlanting ? (
              <motion.div
                className="px-6 w-full max-w-md flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="text-7xl mb-8"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [-8, 8, -8],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {selectedSeed.emoji}
                </motion.div>

                <motion.h1
                  className="text-2xl font-bold text-center mb-2 text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Ready to Plant "{seedName}"?
                </motion.h1>
                <motion.p
                  className="text-center text-muted-foreground mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Your journey begins here
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full"
                >
                  <Button
                    onClick={handlePlant}
                    className="w-full h-16 text-xl rounded-2xl shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, hsl(130 50% 40%), hsl(140 45% 35%))",
                    }}
                  >
                    🌱 Plant My Seed
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <EnhancedPlantingAnimation seedEmoji={selectedSeed.emoji} seedName={seedName} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EnhancedPlantingAnimation = ({ seedEmoji, seedName }: { seedEmoji: string; seedName: string }) => {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-32">
      {/* Magical aura behind planting area */}
      <motion.div
        className="absolute bottom-24 w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(130 60% 50% / 0.3) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.8, 0.4] }}
        transition={{ duration: 2, delay: 1.5 }}
      />

      {/* Ground with hole forming */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(125 50% 42%) 0%, hsl(30 50% 28%) 100%)",
        }}
      >
        {/* Hole animation */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        >
          <svg width="80" height="40" viewBox="0 0 80 40">
            <motion.ellipse
              cx="40"
              cy="20"
              rx="35"
              ry="18"
              fill="hsl(25 40% 18%)"
              initial={{ rx: 0, ry: 0 }}
              animate={{ rx: 35, ry: 18 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            <motion.ellipse
              cx="40"
              cy="18"
              rx="28"
              ry="12"
              fill="hsl(20 35% 12%)"
              initial={{ rx: 0, ry: 0 }}
              animate={{ rx: 28, ry: 12 }}
              transition={{ delay: 1, duration: 0.4 }}
            />
          </svg>
        </motion.div>

        {/* Dirt particles flying up */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `calc(50% + ${(Math.random() - 0.5) * 40}px)`,
              bottom: "40px",
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              background: `hsl(${25 + Math.random() * 10} ${40 + Math.random() * 15}% ${25 + Math.random() * 15}%)`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-50 - Math.random() * 40, 10],
              x: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 0.8,
              delay: 0.8 + i * 0.05,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      {/* Seed with enhanced falling animation */}
      <motion.div
        className="absolute text-6xl z-20"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
        initial={{ y: -300, rotate: 0, scale: 1 }}
        animate={{
          y: [null, -50, "calc(100vh - 180px)"],
          rotate: [0, 180, 540, 720],
          scale: [1, 1.2, 1, 0.8],
        }}
        transition={{
          duration: 2,
          delay: 0.3,
          times: [0, 0.3, 0.7, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {seedEmoji}
      </motion.div>

      {/* Soil covering animation */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.4, type: "spring" }}
      >
        <svg width="90" height="45" viewBox="0 0 90 45">
          <ellipse cx="45" cy="25" rx="40" ry="20" fill="hsl(30 50% 30%)" />
          <ellipse cx="45" cy="22" rx="32" ry="15" fill="hsl(30 55% 35%)" />
          {/* Small mound details */}
          <ellipse cx="35" cy="20" rx="8" ry="4" fill="hsl(30 45% 38%)" opacity="0.7" />
          <ellipse cx="55" cy="22" rx="6" ry="3" fill="hsl(30 45% 38%)" opacity="0.7" />
        </svg>
      </motion.div>

      {/* Sparkle burst on plant */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full z-40"
          style={{
            left: "50%",
            bottom: "150px",
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            background: `hsl(${40 + Math.random() * 40} 100% ${65 + Math.random() * 20}%)`,
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 150],
            y: [0, (Math.random() - 0.5) * 150],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: 2.6 + i * 0.05,
          }}
        />
      ))}

      {/* Magic rings expanding */}
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 rounded-full border-2 z-10"
          style={{ borderColor: `hsl(50 80% 70% / ${0.8 - i * 0.2})` }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: [0, 200 + i * 50],
            height: [0, 200 + i * 50],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 1.5,
            delay: 2.8 + delay,
          }}
        />
      ))}

      {/* Success message */}
      <motion.div
        className="absolute top-1/4 text-center z-50 px-6"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 3, duration: 0.6, type: "spring" }}
      >
        <motion.h2 
          className="text-2xl font-bold text-foreground mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ delay: 3.5, duration: 0.5 }}
        >
          ✨ "{seedName}" planted! ✨
        </motion.h2>
        <p className="text-muted-foreground">Your garden journey begins now...</p>
      </motion.div>
    </div>
  );
};
