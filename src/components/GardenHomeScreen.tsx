import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore - supabase import for profile updates
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { 
  Plus, 
  Sparkles, 
  Droplets, 
  Wind,
  Sun,
  Cloud,
  CloudRain,
  TrendingUp,
  Heart,
  BookOpen,
  ChevronRight,
  X,
  MessageCircle
} from "lucide-react";
import { GardenScene } from "./garden/GardenScene";
import { GrowthStage } from "./garden/Plant";
import { SeedPlantingOnboarding } from "./garden/SeedPlantingOnboarding";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
}

interface AIPrompt {
  text: string;
  category: string;
}

interface GardenHomeScreenProps {
  entries: Entry[];
  onRecordEntry: () => void;
  aiPrompts?: AIPrompt[];
  loadingPrompts?: boolean;
  onPromptTap?: (prompt: string) => void;
  onOpenChat?: () => void;
}

type WeatherMood = "sunny" | "cloudy" | "rainy" | "clearing";
type AnalysisPeriod = "today" | "week" | "month" | "year";

const periodLabels: Record<AnalysisPeriod, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

// Determine growth stage based on entry count
const getGrowthStage = (entryCount: number): GrowthStage => {
  if (entryCount === 0) return "seed";
  if (entryCount < 3) return "rooted";
  if (entryCount < 7) return "sprouting";
  if (entryCount < 15) return "growing";
  return "blooming";
};

// Get stage label
const getStageLabel = (stage: GrowthStage): string => {
  const labels: Record<GrowthStage, string> = {
    seed: "Seedling",
    rooted: "Taking Root",
    sprouting: "Sprouting",
    growing: "Growing Strong",
    blooming: "In Full Bloom"
  };
  return labels[stage];
};

// Weather config
const weatherConfig = {
  sunny: { 
    icon: Sun, 
    gradient: "from-amber-400 via-orange-400 to-yellow-400",
    bg: "from-sky-400 via-sky-300 to-blue-200",
    label: "Radiant"
  },
  cloudy: { 
    icon: Cloud, 
    gradient: "from-slate-400 via-gray-400 to-zinc-400",
    bg: "from-slate-400 via-slate-300 to-gray-200",
    label: "Reflective"
  },
  rainy: { 
    icon: CloudRain, 
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bg: "from-slate-600 via-slate-500 to-gray-400",
    label: "Healing"
  },
  clearing: { 
    icon: Wind, 
    gradient: "from-teal-400 via-cyan-400 to-blue-400",
    bg: "from-sky-300 via-sky-200 to-slate-100",
    label: "Hopeful"
  },
};

// Sentiment analysis for weather mood
const analyzeSentiment = (entries: Entry[]): WeatherMood => {
  if (entries.length === 0) return "cloudy";
  
  const allText = entries.map(e => `${e.title || ""} ${e.content}`).join(" ").toLowerCase();
  
  const positiveWords = ["happy", "joy", "grateful", "wonderful", "amazing", "love", "excited", "great", "beautiful", "blessed", "thankful", "awesome", "fantastic", "peaceful", "calm", "content"];
  const negativeWords = ["sad", "depressed", "lonely", "hurt", "crying", "anxious", "worried", "stress", "nervous", "fear", "overwhelmed", "scared", "angry", "frustrated"];
  const improvingWords = ["better", "improving", "hopeful", "learning", "growing", "trying", "progress", "healing"];
  
  const positiveScore = positiveWords.filter(w => allText.includes(w)).length;
  const negativeScore = negativeWords.filter(w => allText.includes(w)).length;
  const improvingScore = improvingWords.filter(w => allText.includes(w)).length;
  
  if (improvingScore > 0 && negativeScore > 0) return "clearing";
  if (positiveScore > negativeScore) return "sunny";
  if (negativeScore > positiveScore) return "rainy";
  return "cloudy";
};

const filterEntriesByPeriod = (entries: Entry[], period: AnalysisPeriod): Entry[] => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    switch (period) {
      case "today":
        return entryDate >= startOfToday;
      case "week":
        const weekAgo = new Date(startOfToday);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate >= weekAgo;
      case "month":
        const monthAgo = new Date(startOfToday);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return entryDate >= monthAgo;
      case "year":
        const yearAgo = new Date(startOfToday);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return entryDate >= yearAgo;
      default:
        return true;
    }
  });
};

export const GardenHomeScreen = ({ entries, onRecordEntry, aiPrompts, loadingPrompts, onPromptTap, onOpenChat }: GardenHomeScreenProps) => {
  const { user } = useAuth();
  const [weatherMood, setWeatherMood] = useState<WeatherMood>("cloudy");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [showPromptBubble, setShowPromptBubble] = useState(false);
  const [hasPlantedSeed, setHasPlantedSeed] = useState(() => {
    return localStorage.getItem("garden_seed_planted") === "true";
  });
  const [plantName, setPlantName] = useState(() => {
    return localStorage.getItem("garden_plant_name") || "My Journey";
  });
  const [seedType, setSeedType] = useState(() => {
    return localStorage.getItem("garden_seed_type") || "hope";
  });
  const [waterGrowthPulse, setWaterGrowthPulse] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<AnalysisPeriod>("today");
  const [holdDrizzle, setHoldDrizzle] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdActiveRef = useRef(false);

  const growthStage = getGrowthStage(entries.length);
  const stageLabel = getStageLabel(growthStage);
  const filteredEntries = useMemo(() => filterEntriesByPeriod(entries, selectedPeriod), [entries, selectedPeriod]);
  const currentWeather = weatherConfig[weatherMood];
  const WeatherIcon = currentWeather.icon;

  const handleSeedPlanted = async (seedTypeStr: string, name: string, profileInfo?: { displayName: string; bio: string }) => {
    localStorage.setItem("garden_seed_planted", "true");
    localStorage.setItem("garden_seed_type", seedTypeStr);
    localStorage.setItem("garden_plant_name", name);
    localStorage.setItem("garden_seed_planted_date", new Date().toISOString());
    setPlantName(name);
    setSeedType(seedTypeStr);
    setHasPlantedSeed(true);

    // Save profile info if provided
    if (user && profileInfo && (profileInfo.displayName || profileInfo.bio)) {
      await supabase
        .from("profiles")
        .update({
          display_name: profileInfo.displayName || undefined,
          bio: profileInfo.bio || undefined,
          seed_theme: seedTypeStr,
        })
        .eq("user_id", user.id);
    }
  };

  // Hold-to-drizzle: start on long press anywhere on garden
  const startHoldDrizzle = useCallback(() => {
    holdActiveRef.current = true;
    holdTimerRef.current = setTimeout(() => {
      if (holdActiveRef.current && !isWatering) {
        setHoldDrizzle(true);
        setIsWatering(true);
        setTimeout(() => setWaterGrowthPulse(true), 1500);
      }
    }, 400); // 400ms threshold for hold
  }, [isWatering]);

  const stopHoldDrizzle = useCallback(() => {
    holdActiveRef.current = false;
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdDrizzle) {
      setHoldDrizzle(false);
      setTimeout(() => {
        setIsWatering(false);
        setWaterGrowthPulse(false);
      }, 500);
    }
  }, [holdDrizzle]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  const handleWater = async () => {
    if (isWatering) return;
    setShowFabMenu(false);
    setIsWatering(true);
    setTimeout(() => setWaterGrowthPulse(true), 1500);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsWatering(false);
    setWaterGrowthPulse(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    const weatherStates: WeatherMood[] = ["cloudy", "rainy", "clearing", "sunny"];
    for (const state of weatherStates) {
      setWeatherMood(state);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    const detectedMood = analyzeSentiment(filteredEntries);
    setWeatherMood(detectedMood);
    setIsAnalyzing(false);
  };

  // Show onboarding if seed not planted
  if (!hasPlantedSeed) {
    return <SeedPlantingOnboarding onComplete={handleSeedPlanted} />;
  }

  return (
    <motion.div
      className="relative h-screen safe-area-top overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onMouseDown={startHoldDrizzle}
      onMouseUp={stopHoldDrizzle}
      onMouseLeave={stopHoldDrizzle}
      onTouchStart={startHoldDrizzle}
      onTouchEnd={stopHoldDrizzle}
      onTouchCancel={stopHoldDrizzle}
    >
      {/* Dynamic Sky Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b"
        animate={{
          background: `linear-gradient(to bottom, ${
            weatherMood === "sunny" ? "hsl(45, 100%, 85%), hsl(35, 90%, 90%)" :
            weatherMood === "rainy" ? "hsl(220, 30%, 60%), hsl(220, 25%, 75%)" :
            weatherMood === "clearing" ? "hsl(190, 50%, 80%), hsl(190, 40%, 90%)" :
            "hsl(210, 30%, 85%), hsl(210, 25%, 92%)"
          })`
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Animated Clouds - Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cloud 1 - Slow, plain */}
        <motion.div
          className="absolute top-16 left-0 pointer-events-none"
          animate={{ x: ["-20%", "120%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-32 h-12 bg-white/60 rounded-full blur-sm" />
        </motion.div>
        
        {/* Cloud 2 - Medium, carries AI sparkle icon sometimes */}
        <motion.div
          className="absolute top-24 left-0"
          animate={{ x: ["-10%", "110%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear", delay: 5 }}
        >
          <div className="relative">
            <div className="w-40 h-14 bg-white/50 rounded-full blur-[2px]" />
            {/* Sparkle icon that fades in/out intermittently inside the cloud */}
            {aiPrompts && aiPrompts.length > 0 && (
              <motion.button
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                style={{ filter: "none" }}
                animate={{ opacity: [0, 0, 1, 1, 1, 0, 0, 0, 0, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPromptBubble(true);
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Sparkles className="h-5 w-5 text-primary/70 drop-shadow-sm" />
              </motion.button>
            )}
          </div>
        </motion.div>
        
        {/* Cloud 3 - Fast, small, also carries sparkle sometimes (offset timing) */}
        <motion.div
          className="absolute top-8 left-0"
          animate={{ x: ["-15%", "115%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 10 }}
        >
          <div className="relative">
            <div className="w-28 h-10 bg-white/50 rounded-full blur-sm" />
            {aiPrompts && aiPrompts.length > 0 && (
              <motion.button
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                style={{ filter: "none" }}
                animate={{ opacity: [0, 0, 0, 0, 0, 0, 1, 1, 0, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPromptBubble(true);
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Sparkles className="h-4 w-4 text-primary/60 drop-shadow-sm" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Cloud 4 - Extra slow, high */}
        <motion.div
          className="absolute top-12 left-0 pointer-events-none"
          animate={{ x: ["110%", "-20%"] }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear", delay: 15 }}
        >
          <div className="w-36 h-12 bg-white/45 rounded-full blur-md" />
        </motion.div>
      </div>

      {/* AI Prompt Expanded Bubble */}
      <AnimatePresence>
        {showPromptBubble && aiPrompts && aiPrompts.length > 0 && (
          <motion.div
            className="absolute top-36 left-1/2 -translate-x-1/2 w-[85%] max-w-80 z-50"
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/85 shadow-2xl border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-foreground">Writing Prompt</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPromptBubble(false);
                  }}
                  className="p-1 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPromptBubble(false);
                  onPromptTap?.(aiPrompts[0].text);
                }}
                className="text-sm text-muted-foreground text-left hover:text-foreground transition-colors leading-relaxed"
              >
                {aiPrompts[0].text}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Effects */}
      <AnimatePresence mode="wait">
        {weatherMood === "rainy" && (
          <motion.div
            key="rain"
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-8 bg-gradient-to-b from-blue-300/60 to-transparent rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: -20 }}
                animate={{ 
                  y: [0, 800],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
        )}
        
        {weatherMood === "sunny" && (
          <motion.div
            key="sunrays"
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Sun rays */}
            <motion.div
              className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-radial from-amber-300/30 via-amber-200/10 to-transparent rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grass/Swaying Ground Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          {/* Animated grass blades */}
          {[...Array(15)].map((_, i) => (
            <motion.path
              key={i}
              d={`M${20 + i * 25} 100 Q${25 + i * 25} 80 ${20 + i * 25 + (i % 2 === 0 ? 10 : -10)} 70`}
              stroke="hsl(120 40% 45%)"
              strokeWidth="2"
              fill="none"
              animate={{ 
                d: [
                  `M${20 + i * 25} 100 Q${25 + i * 25} 80 ${20 + i * 25 + 5} 70`,
                  `M${20 + i * 25} 100 Q${25 + i * 25} 80 ${20 + i * 25 - 5} 70`,
                  `M${20 + i * 25} 100 Q${25 + i * 25} 80 ${20 + i * 25 + 5} 70`
                ]
              }}
              transition={{ 
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </svg>
      </div>

      {/* Floating Particles - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              background: weatherMood === "sunny" ? "hsl(45 100% 70%)" : 
                         weatherMood === "rainy" ? "hsl(200 80% 80%)" : "white",
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 15, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          />
        ))}
      </div>

      {/* Weather Indicator - Top Right */}
      <motion.div
        className="absolute top-6 right-4 z-30"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
          className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/70 shadow-lg border border-white/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={isAnalyzing ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0 }}
          >
            <WeatherIcon className="h-5 w-5 text-foreground" />
          </motion.div>
          <span className="text-sm font-medium text-foreground">{currentWeather.label}</span>
        </motion.button>
      </motion.div>

      {/* Plant Name & Stage - Top Left */}
      <motion.div
        className="absolute top-6 left-4 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/70 shadow-lg border border-white/50">
          <p className="text-sm font-semibold text-foreground">{plantName}</p>
          <p className="text-xs text-muted-foreground">{stageLabel}</p>
        </div>
      </motion.div>

      {/* Stats Overview - Top */}
      <motion.div
        className="absolute top-20 left-4 right-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex gap-3 justify-center">
          <motion.div 
            className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/60 shadow-md"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-foreground">{entries.length}</span>
              <span className="text-xs text-muted-foreground">entries</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/60 shadow-md"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500" />
              <span className="text-lg font-bold text-foreground">{filteredEntries.length}</span>
              <span className="text-xs text-muted-foreground">this {periodLabels[selectedPeriod].toLowerCase()}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Garden Scene - Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GardenScene
          weatherMood={weatherMood}
          growthStage={growthStage}
          plantName={plantName}
          seedType={seedType}
          isAnalyzing={isAnalyzing}
          isWatering={isWatering}
          waterGrowthPulse={waterGrowthPulse}
        />
      </div>

      {/* Analysis Panel */}
      <AnimatePresence>
        {showAnalysisPanel && (
          <motion.div
            className="absolute top-32 right-4 z-40 w-72"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
          >
            <div className="p-4 rounded-3xl backdrop-blur-xl bg-white/80 shadow-2xl border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">Analysis</h3>
                <button 
                  onClick={() => setShowAnalysisPanel(false)}
                  className="p-1 rounded-full hover:bg-muted/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Period Selector */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(Object.keys(periodLabels) as AnalysisPeriod[]).map((period) => (
                  <motion.button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedPeriod === period 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {periodLabels[period]}
                  </motion.button>
                ))}
              </div>

              {/* Mood Display */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${currentWeather.gradient}`}>
                    <WeatherIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{currentWeather.label}</p>
                    <p className="text-xs text-muted-foreground">Current mood</p>
                  </div>
                </div>
              </div>

              {/* Analyse Button */}
              <motion.button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="h-4 w-4" />
                {isAnalyzing ? "Analysing..." : "Analyse Mood"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Button - Bottom Left */}
      <motion.button
        className="absolute bottom-[6.5rem] left-6 z-50 w-12 h-12 rounded-full backdrop-blur-xl bg-white/60 shadow-lg border border-white/40 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenChat?.();
        }}
      >
        <MessageCircle className="h-5 w-5 text-primary" />
      </motion.button>

      {/* Floating Action Button (FAB) */}
      <div className="absolute bottom-[6.5rem] right-6 z-50">
        <AnimatePresence>
          {showFabMenu && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFabMenu(false)}
              />
              <motion.div
                className="absolute bottom-16 right-0 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <motion.button
                  onClick={handleWater}
                  disabled={isWatering}
                  className="flex items-center gap-3 pr-4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-sm font-medium text-foreground bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-lg">
                    Water Plant
                  </span>
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl flex items-center justify-center"
                    animate={isWatering ? { rotate: [0, -15, 15, 0] } : {}}
                    transition={{ duration: 0.3, repeat: isWatering ? Infinity : 0 }}
                  >
                    <Droplets className="h-5 w-5 text-white" />
                  </motion.div>
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowFabMenu(false);
                    onRecordEntry();
                  }}
                  className="flex items-center gap-3 pr-4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: 0 }}
                >
                  <span className="text-sm font-medium text-foreground bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-lg">
                    New Entry
                  </span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl flex items-center justify-center">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-foreground shadow-2xl flex items-center justify-center"
          animate={{ rotate: showFabMenu ? 45 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="h-6 w-6 text-white" />
        </motion.button>
      </div>

      {/* Stage progress removed - now shown in plant info card */}

      {/* Hold-to-drizzle indicator */}
      <AnimatePresence>
        {holdDrizzle && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="px-5 py-2.5 rounded-full backdrop-blur-xl bg-blue-500/20 border border-blue-300/40 shadow-lg">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-100">Drizzling...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
