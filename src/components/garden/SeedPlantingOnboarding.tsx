import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
  onComplete: (seedType: string, seedName: string, profileInfo?: { displayName: string; bio: string }) => void;
}

type Step = "select" | "name" | "profile" | "plant";

export const SeedPlantingOnboarding = ({ onComplete }: SeedPlantingOnboardingProps) => {
  const [step, setStep] = useState<Step>("select");
  const [selectedSeed, setSelectedSeed] = useState<SeedOption | null>(null);
  const [seedName, setSeedName] = useState("");
  const [isPlanting, setIsPlanting] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");

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
    await new Promise(resolve => setTimeout(resolve, 3200));
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

        {/* Animated clouds - drifting across screen */}
        {[
          { top: "8%", size: 120, speed: 40, startOffset: -10 },
          { top: "5%", size: 100, speed: 55, startOffset: 25 },
          { top: "10%", size: 110, speed: 45, startOffset: 50 },
          { top: "6%", size: 90, speed: 60, startOffset: 75 },
        ].map((cloud, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: cloud.top, width: cloud.size, height: cloud.size * 0.4, left: `${cloud.startOffset}%` }}
            animate={{ x: [-(cloud.size + 100), typeof window !== 'undefined' ? window.innerWidth + cloud.size + 100 : 600] }}
            transition={{ duration: cloud.speed, repeat: Infinity, ease: "linear", repeatDelay: Math.random() * 8 }}
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
            {Array.from({ length: 50 }).map((_, i) => {
              const x = i * 8 + 2;
              const qy1 = 12 + (i * 13 % 8);
              const qy2 = 10 + (i * 11 % 8);
              return (
                <motion.path
                  key={i}
                  d={`M${x} 30 Q${x + 2} ${qy1} ${x + 4} 30`}
                  fill="none"
                  stroke={`hsl(${125 + (i * 7 % 10)} ${45 + (i * 11 % 10)}% ${35 + (i * 13 % 8)}%)`}
                  strokeWidth="1.5"
                  animate={{ 
                    d: [
                      `M${x} 30 Q${x + 2} ${qy1} ${x + 4} 30`,
                      `M${x} 30 Q${x + 3} ${qy2} ${x + 4} 30`,
                      `M${x} 30 Q${x + 2} ${qy1} ${x + 4} 30`,
                    ]
                  }}
                  transition={{ duration: 2 + (i % 3), repeat: Infinity }}
                />
              );
            })}
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
  // Pre-computed dirt particles
  const dirtParticles = Array.from({ length: 12 }).map((_, i) => ({
    offsetX: (i - 6) * 10,
    size: 3 + (i % 3) * 2,
    hue: 25 + i * 3,
    lightness: 28 + i * 2,
    yTravel: -25 - i * 6,
    xTravel: (i - 6) * 8,
    delay: 0.3 + i * 0.025,
  }));

  // Pre-computed magic burst particles
  const magicParticles = Array.from({ length: 14 }).map((_, i) => ({
    angle: (i / 14) * Math.PI * 2,
    dist: 35 + (i * 5 % 25),
    size: 3 + (i % 3) * 2,
    hue: 120 + i * 8,
    lightness: 55 + i * 3,
    delay: 2.3 + i * 0.035,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Atmospheric darkening for drama */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.3] }}
        style={{ background: "linear-gradient(180deg, hsl(220 30% 15% / 0.4) 0%, transparent 70%)" }}
        transition={{ duration: 2, times: [0, 0.4, 1] }}
      />

      {/* Ground layer */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(125 50% 42%) 0%, hsl(120 45% 35%) 40%, hsl(30 50% 28%) 100%)",
        }}
      >
        {/* Soil hole opens with a smooth scale */}
        <motion.div
          className="absolute top-6 left-1/2 -translate-x-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 180, damping: 15 }}
        >
          <svg width="100" height="50" viewBox="0 0 100 50">
            <motion.ellipse cx="50" cy="25" rx="40" ry="20" fill="hsl(25 40% 18%)"
              initial={{ rx: 0, ry: 0 }} animate={{ rx: 40, ry: 20 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }} />
            <motion.ellipse cx="50" cy="22" rx="30" ry="14" fill="hsl(20 35% 12%)"
              initial={{ rx: 0, ry: 0 }} animate={{ rx: 30, ry: 14 }}
              transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }} />
          </svg>
        </motion.div>

        {/* Dirt particles fly out smoothly */}
        {dirtParticles.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              left: `calc(50% + ${p.offsetX}px)`, top: "24px",
              width: p.size, height: p.size,
              background: `hsl(${p.hue} 45% ${p.lightness}%)`,
            }}
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{
              y: [0, p.yTravel, p.yTravel * 0.3],
              x: [0, p.xTravel, p.xTravel * 0.6],
              opacity: [0, 0.9, 0],
              scale: [0, 1.2, 0.3],
              rotate: [0, 180 + i * 30],
            }}
            transition={{ duration: 0.7, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Soil mound covers seed smoothly */}
        <motion.div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-30"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: "bottom" }}
        >
          <svg width="90" height="40" viewBox="0 0 90 40">
            <ellipse cx="45" cy="28" rx="38" ry="16" fill="hsl(30 50% 30%)" />
            <ellipse cx="45" cy="25" rx="28" ry="12" fill="hsl(30 55% 35%)" />
          </svg>
        </motion.div>

        {/* Sprout emerging with natural growth curve */}
        <motion.svg
          className="absolute top-0 left-1/2 -translate-x-1/2 z-40"
          width="60" height="60" viewBox="0 0 60 60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
        >
          <motion.path d="M30 55 Q30 45 28 30" stroke="hsl(130 55% 42%)" strokeWidth="3" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.0, duration: 1, ease: [0.4, 0, 0.2, 1] }} />
          <motion.ellipse cx="23" cy="32" rx="7" ry="4" fill="hsl(135 60% 50%)" transform="rotate(-35 23 32)"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.7, duration: 0.4, type: "spring", stiffness: 250, damping: 12 }} />
          <motion.ellipse cx="35" cy="30" rx="8" ry="4.5" fill="hsl(130 55% 46%)" transform="rotate(30 35 30)"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.85, duration: 0.4, type: "spring", stiffness: 250, damping: 12 }} />
        </motion.svg>
      </motion.div>

      {/* Seed falls gracefully from above */}
      <motion.div
        className="absolute text-5xl z-20"
        style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.3))" }}
        initial={{ top: "8%", scale: 1.3, opacity: 0 }}
        animate={{
          top: ["8%", "25%", "calc(100% - 185px)"],
          opacity: [0, 1, 1, 0],
          rotate: [0, 90, 280],
          scale: [1.3, 1.1, 0.6],
        }}
        transition={{
          duration: 1.4,
          delay: 0.5,
          times: [0, 0.35, 1],
          ease: [0.45, 0, 0.55, 1],
          opacity: { times: [0, 0.08, 0.82, 1], duration: 1.4, delay: 0.5 },
        }}
      >
        {seedEmoji}
      </motion.div>

      {/* Green magic burst when sprout appears */}
      {magicParticles.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full z-30"
          style={{
            left: "50%", bottom: "155px",
            width: p.size, height: p.size,
            background: `hsl(${p.hue} 70% ${p.lightness}%)`,
            boxShadow: `0 0 6px 2px hsl(${p.hue} 60% ${p.lightness}% / 0.4)`,
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.3, 0],
            x: [0, Math.cos(p.angle) * p.dist],
            y: [0, Math.sin(p.angle) * p.dist - 15],
            opacity: [0, 0.9, 0],
          }}
          transition={{ duration: 0.9, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Double expanding rings for polish */}
      {[0, 0.15].map((extraDelay, idx) => (
        <motion.div
          key={idx}
          className="absolute left-1/2 -translate-x-1/2 rounded-full border-2 z-10"
          style={{ bottom: "140px", borderColor: `hsl(130 60% ${55 + idx * 10}% / ${0.5 - idx * 0.15})` }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: 160 + idx * 40, height: 160 + idx * 40, opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.1, delay: 2.4 + extraDelay, ease: "easeOut" }}
        />
      ))}

      {/* Success text with smoother entrance */}
      <motion.div
        className="absolute top-[18%] left-0 right-0 text-center z-50 px-6"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.6, type: "spring", stiffness: 180, damping: 18 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-1">
          🌱 "{seedName}" planted!
        </h2>
        <motion.p className="text-muted-foreground text-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 0.4 }}>
          Your garden journey begins now...
        </motion.p>
      </motion.div>
    </div>
  );
};
