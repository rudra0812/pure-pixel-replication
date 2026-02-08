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
    await new Promise(resolve => setTimeout(resolve, 2500));
    onComplete(selectedSeed!.id, seedName);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, hsl(200 60% 75%) 0%, hsl(180 40% 85%) 50%, hsl(130 35% 65%) 100%)",
        }}
      />

      {/* Animated stars/particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
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
                  className="relative p-4 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-transparent hover:border-primary/50 transition-colors"
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
                      y: [0, -5, 0],
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
                scale: [1, 1.1, 1],
                rotate: [-3, 3, -3],
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
                className="h-14 text-lg text-center rounded-2xl bg-card/80 border-border/50"
                autoFocus
              />
              <Button
                onClick={handleNameSeed}
                disabled={!seedName.trim()}
                className="w-full h-14 text-lg rounded-2xl"
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

        {/* Step 3: Plant Animation */}
        {step === "plant" && selectedSeed && (
          <motion.div
            key="plant"
            className="relative z-10 px-6 w-full max-w-md flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {!isPlanting ? (
              <>
                <motion.div
                  className="text-7xl mb-8"
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [-5, 5, -5],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
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
                    className="w-full h-16 text-xl rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, hsl(130 50% 40%), hsl(140 45% 35%))",
                    }}
                  >
                    🌱 Plant My Seed
                  </Button>
                </motion.div>
              </>
            ) : (
              <PlantingAnimation seedEmoji={selectedSeed.emoji} seedName={seedName} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PlantingAnimation = ({ seedEmoji, seedName }: { seedEmoji: string; seedName: string }) => {
  return (
    <div className="relative w-full h-80 flex flex-col items-center justify-end">
      {/* Ground */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 rounded-t-[50%]"
        style={{ background: "linear-gradient(180deg, hsl(30 50% 32%), hsl(25 45% 25%))" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Hole in ground */}
      <motion.div
        className="absolute bottom-16 w-16 h-8 rounded-[50%]"
        style={{ background: "hsl(25 40% 18%)" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      />

      {/* Seed falling and planting */}
      <motion.div
        className="absolute text-5xl"
        initial={{ y: -200, rotate: 0 }}
        animate={{ 
          y: [null, 60],
          rotate: [0, 360, 720],
          scale: [1, 1, 0.8],
        }}
        transition={{ 
          duration: 1.5, 
          delay: 0.8,
          times: [0, 0.7, 1],
        }}
      >
        {seedEmoji}
      </motion.div>

      {/* Soil covering */}
      <motion.div
        className="absolute bottom-12 w-20 h-10 rounded-[50%]"
        style={{ background: "hsl(30 50% 30%)" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.3, duration: 0.3 }}
      />

      {/* Success text */}
      <motion.div
        className="absolute top-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-foreground">"{seedName}" planted!</h2>
        <p className="text-muted-foreground mt-1">Your garden is ready...</p>
      </motion.div>

      {/* Sparkles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: "hsl(50 100% 70%)",
            left: `${40 + Math.random() * 20}%`,
            bottom: "60px",
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [-20 - Math.random() * 40],
            x: [(Math.random() - 0.5) * 60],
          }}
          transition={{ 
            delay: 2.3 + i * 0.1, 
            duration: 0.8,
          }}
        />
      ))}
    </div>
  );
};
