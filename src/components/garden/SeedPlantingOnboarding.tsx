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
      setStep("profile");
    }
  };

  const handlePlant = () => {
    setIsPlanting(true);
  };

  const handleFinish = () => {
    onComplete(selectedSeed!.id, seedName, { displayName: profileName.trim(), bio: profileBio.trim() });
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

        {/* Step 2.5: Profile Info */}
        {step === "profile" && (
          <motion.div
            key="profile"
            className="relative z-10 px-6 w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-2xl font-bold text-center mb-2 text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Tell us about you
            </motion.h1>
            <motion.p
              className="text-center text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              You can always update this later
            </motion.p>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Name</label>
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="What should we call you?"
                  className="h-14 text-lg rounded-2xl bg-card/85 backdrop-blur-md border-border/50"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">About You <span className="text-muted-foreground">(optional)</span></label>
                <Textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="A few words about yourself..."
                  className="min-h-[80px] rounded-2xl bg-card/85 backdrop-blur-md border-border/50 resize-none"
                  maxLength={300}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("plant")}
                  className="flex-1 h-14 text-lg rounded-2xl bg-card/85 backdrop-blur-md"
                >
                  Skip
                </Button>
                <Button
                  onClick={() => setStep("plant")}
                  className="flex-1 h-14 text-lg rounded-2xl shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, hsl(130 50% 40%), hsl(140 45% 35%))",
                  }}
                >
                  Continue
                </Button>
              </div>
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
              <GuidedPlantingFlow
                seedEmoji={selectedSeed.emoji}
                seedName={seedName}
                onFinish={handleFinish}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EnhancedPlantingAnimation = ({ seedEmoji, seedName }: { seedEmoji: string; seedName: string }) => {
  // Pre-computed dirt particles bursting outward when seed lands
  const dirtParticles = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i / 16) * Math.PI - Math.PI; // upper hemisphere
    const dist = 40 + (i * 7 % 30);
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist * 0.9,
      size: 4 + (i % 3) * 2,
      hue: 25 + (i * 3 % 15),
      lightness: 26 + (i * 2 % 12),
      delay: 1.55 + (i * 0.012),
    };
  });

  // Magic sparkle burst when sprout appears
  const magicParticles = Array.from({ length: 18 }).map((_, i) => ({
    angle: (i / 18) * Math.PI * 2,
    dist: 50 + (i * 6 % 40),
    size: 3 + (i % 3) * 2,
    hue: 110 + (i * 9 % 40),
    lightness: 55 + (i * 3 % 15),
    delay: 2.9 + i * 0.025,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft vignette to focus attention center */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, hsl(220 30% 10% / 0.35) 100%)",
        }}
        transition={{ duration: 1.2 }}
      />

      {/* Planting stage anchored to the ground line (ground is h-32 = 128px) */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: 280, height: 280, bottom: 96 }}
      >
        {/* Soil patch */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 0, width: 220, height: 70 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <svg viewBox="0 0 220 70" className="w-full h-full">
            <defs>
              <radialGradient id="soilGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="hsl(28 55% 38%)" />
                <stop offset="60%" stopColor="hsl(25 50% 28%)" />
                <stop offset="100%" stopColor="hsl(22 45% 20%)" />
              </radialGradient>
              <radialGradient id="holeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(20 40% 10%)" />
                <stop offset="100%" stopColor="hsl(22 40% 18%)" />
              </radialGradient>
            </defs>
            <ellipse cx="110" cy="40" rx="105" ry="28" fill="url(#soilGrad)" />
            {/* Hole that opens */}
            <motion.ellipse
              cx="110" cy="36" rx="0" ry="0" fill="url(#holeGrad)"
              animate={{ rx: [0, 26, 26, 0], ry: [0, 11, 11, 0] }}
              transition={{
                duration: 4.2,
                times: [0, 0.18, 0.45, 0.62],
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>

        {/* Seed gently arcs down into the hole */}
        <motion.div
          className="absolute left-1/2 text-5xl"
          style={{
            filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))",
            translateX: "-50%",
          }}
          initial={{ top: -40, opacity: 0, rotate: 0, scale: 1.2 }}
          animate={{
            top: [-40, 30, 180, 200],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 320, 360],
            scale: [1.2, 1, 0.55, 0.4],
          }}
          transition={{
            duration: 1.5,
            delay: 0.4,
            times: [0, 0.35, 0.85, 1],
            ease: [0.5, 0, 0.6, 1],
          }}
        >
          {seedEmoji}
        </motion.div>

        {/* Dirt bursts upward when seed lands */}
        {dirtParticles.map((p, i) => (
          <motion.div
            key={`d-${i}`}
            className="absolute left-1/2 rounded-full"
            style={{
              bottom: 36,
              width: p.size,
              height: p.size,
              background: `hsl(${p.hue} 50% ${p.lightness}%)`,
              translateX: "-50%",
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [0, p.x, p.x * 1.1],
              y: [0, p.y, 10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0.4],
              rotate: [0, 180],
            }}
            transition={{
              duration: 0.85,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

        {/* Soil mound covers the seed */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 32, width: 90 }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <svg viewBox="0 0 90 32" style={{ display: "block" }}>
            <ellipse cx="45" cy="22" rx="42" ry="13" fill="hsl(28 50% 30%)" />
            <ellipse cx="45" cy="18" rx="32" ry="10" fill="hsl(30 55% 36%)" />
            <ellipse cx="38" cy="14" rx="6" ry="2.5" fill="hsl(32 60% 44%)" opacity="0.6" />
          </svg>
        </motion.div>

        {/* Sprout emerges from the mound */}
        <motion.svg
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 42 }}
          width="80" height="100" viewBox="0 0 80 100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.85 }}
        >
          <motion.path
            d="M40 95 Q40 70 38 45"
            stroke="hsl(130 55% 40%)" strokeWidth="3.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.85, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.ellipse
            cx="28" cy="52" rx="11" ry="5.5" fill="hsl(135 60% 48%)"
            transform="rotate(-32 28 52)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ transformOrigin: "40px 60px" }}
            transition={{ delay: 3.45, duration: 0.45, type: "spring", stiffness: 220, damping: 14 }}
          />
          <motion.ellipse
            cx="50" cy="48" rx="12" ry="6" fill="hsl(128 58% 44%)"
            transform="rotate(28 50 48)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ transformOrigin: "40px 60px" }}
            transition={{ delay: 3.6, duration: 0.45, type: "spring", stiffness: 220, damping: 14 }}
          />
        </motion.svg>

        {/* Magic sparkle burst */}
        {magicParticles.map((p, i) => (
          <motion.div
            key={`m-${i}`}
            className="absolute left-1/2 rounded-full"
            style={{
              bottom: 70,
              width: p.size,
              height: p.size,
              background: `hsl(${p.hue} 75% ${p.lightness}%)`,
              boxShadow: `0 0 8px 2px hsl(${p.hue} 70% ${p.lightness}% / 0.5)`,
              translateX: "-50%",
            }}
            initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.4, 0],
              x: [0, Math.cos(p.angle) * p.dist],
              y: [0, Math.sin(p.angle) * p.dist - 20],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.1, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Expanding rings */}
        {[0, 0.18, 0.36].map((extraDelay, idx) => (
          <motion.div
            key={`r-${idx}`}
            className="absolute left-1/2 -translate-x-1/2 rounded-full border-2"
            style={{
              bottom: 60,
              borderColor: `hsl(130 65% ${55 + idx * 8}% / ${0.55 - idx * 0.15})`,
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: 180 + idx * 50,
              height: 180 + idx * 50,
              opacity: [0, 0.6, 0],
            }}
            transition={{ duration: 1.4, delay: 2.95 + extraDelay, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Success text */}
      <motion.div
        className="absolute top-[12%] left-0 right-0 text-center px-6"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 3.3, duration: 0.6, type: "spring", stiffness: 180, damping: 18 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-1">
          🌱 "{seedName}" planted!
        </h2>
        <motion.p
          className="text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, duration: 0.4 }}
        >
          Your garden journey begins now…
        </motion.p>
      </motion.div>
    </div>
  );
};
