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

type GuidedStage = "dig" | "drop" | "cover" | "water" | "grow";

const GuidedPlantingFlow = ({
  seedEmoji,
  seedName,
  onFinish,
}: {
  seedEmoji: string;
  seedName: string;
  onFinish: () => void;
}) => {
  const [stage, setStage] = useState<GuidedStage>("dig");
  const [waterHoldProgress, setWaterHoldProgress] = useState(0);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const guidance: Record<GuidedStage, { title: string; hint: string; cta?: string }> = {
    dig: { title: "Prepare the soil", hint: "Tap to dig a small hole", cta: "Dig hole" },
    drop: { title: "Plant your seed", hint: "Tap to gently drop the seed in", cta: "Drop seed" },
    cover: { title: "Cover with soil", hint: "Tap to tuck it in safely", cta: "Cover with soil" },
    water: { title: "Give it water", hint: "Press & hold the watering can", cta: "Hold to water" },
    grow: { title: "It's growing!", hint: "Your journey begins now", cta: "Enter your garden" },
  };

  // Advance stages
  const next = () => {
    setStage((s) => {
      if (s === "dig") return "drop";
      if (s === "drop") return "cover";
      if (s === "cover") return "water";
      return s;
    });
  };

  // Hold-to-water logic
  const startHold = () => {
    if (stage !== "water") return;
    if (holdRef.current) return;
    holdRef.current = setInterval(() => {
      setWaterHoldProgress((p) => {
        const np = Math.min(100, p + 4);
        if (np >= 100) {
          clearInterval(holdRef.current!);
          holdRef.current = null;
          setTimeout(() => setStage("grow"), 200);
        }
        return np;
      });
    }, 50);
  };
  const stopHold = () => {
    if (holdRef.current) {
      clearInterval(holdRef.current);
      holdRef.current = null;
    }
  };
  useEffect(() => () => { if (holdRef.current) clearInterval(holdRef.current); }, []);

  const g = guidance[stage];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      {/* Guidance card pinned top */}
      <motion.div
        key={stage + "-card"}
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[88%] max-w-md text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="px-5 py-3 rounded-2xl bg-card/85 backdrop-blur-md shadow-lg border border-border/50">
          <h2 className="text-lg font-bold text-foreground">{g.title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{g.hint}</p>
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {(["dig", "drop", "cover", "water", "grow"] as GuidedStage[]).map((s, i) => {
              const order = ["dig", "drop", "cover", "water", "grow"];
              const active = order.indexOf(stage) >= i;
              return (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${active ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
                />
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Centered planting stage */}
      <div className="relative w-full flex items-end justify-center" style={{ height: 320, marginTop: 40 }}>
        <div className="relative" style={{ width: 280, height: 280 }}>
          {/* Soil base */}
          <svg viewBox="0 0 280 90" className="absolute bottom-0 left-0 w-full" style={{ height: 90 }}>
            <defs>
              <radialGradient id="soilG" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="hsl(28 55% 38%)" />
                <stop offset="60%" stopColor="hsl(25 50% 28%)" />
                <stop offset="100%" stopColor="hsl(22 45% 20%)" />
              </radialGradient>
              <radialGradient id="holeG" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(20 40% 10%)" />
                <stop offset="100%" stopColor="hsl(22 40% 18%)" />
              </radialGradient>
            </defs>
            <ellipse cx="140" cy="50" rx="130" ry="35" fill="url(#soilG)" />
            {/* Hole opens at "dig", stays open through "drop", closes at "cover" */}
            <motion.ellipse
              cx="140"
              cy="46"
              fill="url(#holeG)"
              initial={{ rx: 0, ry: 0 }}
              animate={{
                rx: stage === "dig" ? 0 : (stage === "drop" || stage === "cover" ? 30 : 0),
                ry: stage === "dig" ? 0 : (stage === "drop" || stage === "cover" ? 12 : 0),
              }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </svg>

          {/* Seed drops in during "drop" stage */}
          <AnimatePresence>
            {(stage === "drop" || stage === "cover") && (
              <motion.div
                key="seed"
                className="absolute left-1/2 text-5xl"
                style={{ translateX: "-50%", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))" }}
                initial={{ top: -80, opacity: 0, rotate: 0, scale: 1.2 }}
                animate={
                  stage === "drop"
                    ? { top: 200, opacity: 1, rotate: 320, scale: 0.55 }
                    : { top: 220, opacity: 0, scale: 0.4 }
                }
                transition={{ duration: 1.0, ease: [0.5, 0, 0.6, 1] }}
              >
                {seedEmoji}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Soil mound covers seed at "cover" and after */}
          <AnimatePresence>
            {(stage === "cover" || stage === "water" || stage === "grow") && (
              <motion.div
                key="mound"
                className="absolute left-1/2 -translate-x-1/2"
                style={{ bottom: 30, width: 110 }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <svg viewBox="0 0 110 36" style={{ display: "block" }}>
                  <ellipse cx="55" cy="26" rx="50" ry="14" fill="hsl(28 50% 30%)" />
                  <ellipse cx="55" cy="20" rx="38" ry="11" fill="hsl(30 55% 36%)" />
                  <ellipse cx="46" cy="16" rx="7" ry="3" fill="hsl(32 60% 44%)" opacity="0.6" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Watering can pours during "water" */}
          <AnimatePresence>
            {stage === "water" && (
              <motion.div
                key="can"
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: 10 }}
                initial={{ y: -30, opacity: 0, rotate: 0 }}
                animate={{ y: 0, opacity: 1, rotate: -25 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
              >
                <div className="text-5xl">🪣</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Falling water droplets while holding */}
          {stage === "water" && waterHoldProgress > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 rounded-full"
                  style={{
                    top: 60,
                    width: 4,
                    height: 10,
                    background: "linear-gradient(180deg, hsl(200 85% 78%), hsl(210 90% 60%))",
                    translateX: `calc(-50% + ${(i - 4) * 4}px)`,
                  }}
                  animate={{ top: [60, 200], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7, delay: i * 0.08, repeat: Infinity, ease: "easeIn" }}
                />
              ))}
            </div>
          )}

          {/* Sprout grows in "grow" stage */}
          <AnimatePresence>
            {stage === "grow" && (
              <motion.svg
                key="sprout"
                className="absolute left-1/2 -translate-x-1/2"
                style={{ bottom: 38 }}
                width="90"
                height="120"
                viewBox="0 0 90 120"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.path
                  d="M45 115 Q45 80 42 50"
                  stroke="hsl(130 55% 40%)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
                />
                <motion.ellipse
                  cx="30" cy="58" rx="12" ry="6" fill="hsl(135 60% 48%)"
                  transform="rotate(-32 30 58)"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ transformOrigin: "45px 70px" }}
                  transition={{ delay: 0.7, duration: 0.5, type: "spring", stiffness: 220, damping: 14 }}
                />
                <motion.ellipse
                  cx="58" cy="54" rx="13" ry="6.5" fill="hsl(128 58% 44%)"
                  transform="rotate(28 58 54)"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ transformOrigin: "45px 70px" }}
                  transition={{ delay: 0.9, duration: 0.5, type: "spring", stiffness: 220, damping: 14 }}
                />
                {/* Sparkle burst */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * Math.PI * 2;
                  return (
                    <motion.circle
                      key={i}
                      cx="45" cy="60" r="2"
                      fill="hsl(50 90% 70%)"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        cx: 45 + Math.cos(angle) * 40,
                        cy: 60 + Math.sin(angle) * 40,
                      }}
                      transition={{ duration: 1.2, delay: 1.0 + i * 0.04, ease: "easeOut" }}
                    />
                  );
                })}
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action button */}
      <motion.div
        key={stage + "-btn"}
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[88%] max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {stage === "water" ? (
          <div className="space-y-2">
            <Button
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              onTouchCancel={stopHold}
              className="w-full h-16 text-lg rounded-2xl shadow-xl select-none"
              style={{
                background: "linear-gradient(135deg, hsl(200 70% 50%), hsl(210 65% 45%))",
              }}
            >
              💧 {g.cta}
            </Button>
            <div className="w-full h-2 rounded-full bg-card/60 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                animate={{ width: `${waterHoldProgress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </div>
        ) : stage === "grow" ? (
          <Button
            onClick={onFinish}
            className="w-full h-16 text-lg rounded-2xl shadow-xl"
            style={{ background: "linear-gradient(135deg, hsl(130 50% 40%), hsl(140 45% 35%))" }}
          >
            🌱 {g.cta}
          </Button>
        ) : (
          <Button
            onClick={next}
            className="w-full h-16 text-lg rounded-2xl shadow-xl"
            style={{ background: "linear-gradient(135deg, hsl(130 50% 40%), hsl(140 45% 35%))" }}
          >
            {stage === "dig" ? "⛏️" : stage === "drop" ? "🌰" : "🪨"} {g.cta}
          </Button>
        )}
      </motion.div>

      {/* Success banner when grown */}
      <AnimatePresence>
        {stage === "grow" && (
          <motion.div
            className="absolute top-[24%] left-0 right-0 text-center px-6 pointer-events-none"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 180, damping: 18 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-1">
              🌱 "{seedName}" is alive!
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
