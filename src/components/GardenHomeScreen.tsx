import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Plus, ChevronDown, Droplets } from "lucide-react";
import { Button } from "./ui/button";
import { GardenScene } from "./garden/GardenScene";
import { GrowthStage } from "./garden/Plant";
import { SeedPlantingOnboarding } from "./garden/SeedPlantingOnboarding";

interface Entry {
  id: string;
  date: string; // ISO string
  title?: string;
  content: string;
  wordCount?: number;
  quality?: 'short' | 'medium' | 'long';
  hasMedia?: boolean;
}

interface GardenHomeScreenProps {
  entries: Entry[];
  onRecordEntry: () => void;
}

type WeatherMood = "sunny" | "cloudy" | "rainy" | "clearing";
type AnalysisPeriod = "today" | "week" | "month" | "year";

const periodLabels: Record<AnalysisPeriod, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

// Determine growth stage based on entry count (fixed to prevent spam)
const getGrowthStage = (entries: Entry[]): GrowthStage => {
  // Count unique days with entries for meaningful growth
  const uniqueDays = new Set(entries.map(e => new Date(e.date).toDateString())).size;
  
  if (uniqueDays === 0) return "seed";
  if (uniqueDays < 3) return "rooted";
  if (uniqueDays < 7) return "sprouting";
  if (uniqueDays < 15) return "growing";
  return "blooming";
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
    // Parse ISO string date
    const entryDate = new Date(entry.date);
    const entryDateOnly = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
    
    switch (period) {
      case "today":
        return entryDateOnly.getTime() === startOfToday.getTime();
      case "week":
        const weekAgo = new Date(startOfToday);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDateOnly >= weekAgo;
      case "month":
        const monthAgo = new Date(startOfToday);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return entryDateOnly >= monthAgo;
      case "year":
        const yearAgo = new Date(startOfToday);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return entryDateOnly >= yearAgo;
      default:
        return true;
    }
  });
};

export const GardenHomeScreen = ({ entries, onRecordEntry }: GardenHomeScreenProps) => {
  const [weatherMood, setWeatherMood] = useState<WeatherMood>("cloudy");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasPlantedSeed, setHasPlantedSeed] = useState(() => {
    return localStorage.getItem("garden_seed_planted") === "true";
  });
  const [plantName, setPlantName] = useState(() => {
    return localStorage.getItem("garden_plant_name") || "My Journey";
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const growthStage = getGrowthStage(entries);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSeedPlanted = (seedType: string, name: string) => {
    localStorage.setItem("garden_seed_planted", "true");
    localStorage.setItem("garden_seed_type", seedType);
    localStorage.setItem("garden_plant_name", name);
    setPlantName(name);
    setHasPlantedSeed(true);
  };

  const [waterGrowthPulse, setWaterGrowthPulse] = useState(false);

  const handleWater = async () => {
    if (isWatering) return;
    setIsWatering(true);
    // Trigger growth pulse after water reaches the plant
    setTimeout(() => setWaterGrowthPulse(true), 1500);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsWatering(false);
    setWaterGrowthPulse(false);
  };

  const handleAnalyze = async (period: AnalysisPeriod) => {
    setShowDropdown(false);
    setIsAnalyzing(true);
    
    // Cycle through weather states for animation effect
    const weatherStates: WeatherMood[] = ["cloudy", "rainy", "clearing", "sunny"];
    for (const state of weatherStates) {
      setWeatherMood(state);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Final analysis
    const filteredEntries = filterEntriesByPeriod(entries, period);
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
      className="flex min-h-screen flex-col safe-area-top pb-28 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Garden Scene */}
      <div className="flex-1 relative">
        <GardenScene
          weatherMood={weatherMood}
          growthStage={growthStage}
          plantName={plantName}
          isAnalyzing={isAnalyzing}
          isWatering={isWatering}
          waterGrowthPulse={waterGrowthPulse}
        />

        {/* Water Button - Right side */}
        <motion.button
          onClick={handleWater}
          disabled={isWatering}
          aria-label={isWatering ? "Watering plant" : "Water your plant"}
          aria-pressed={isWatering}
          className="absolute right-4 top-1/3 z-30 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-card/90 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={isWatering ? { 
            rotate: [0, -10, 10, -10, 10, 0],
            y: [0, -5, 0],
          } : {}}
          transition={{ duration: 0.5, repeat: isWatering ? Infinity : 0 }}
        >
          <Droplets 
            className={`h-6 w-6 ${isWatering ? "text-blue-400" : "text-muted-foreground"}`}
            aria-hidden="true"
          />
          {/* Water drops effect from can */}
          {isWatering && (
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
                  style={{ left: (i - 1) * 6 }}
                  animate={{
                    y: [0, 20],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="absolute bottom-28 left-0 right-0 px-6 z-20">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          {/* Primary CTA - Record Journal */}
          <Button
            onClick={onRecordEntry}
            aria-label="Record today's journal entry"
            className="w-full h-14 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            style={{
              background: "linear-gradient(135deg, hsl(130 50% 40%), hsl(140 45% 35%))",
            }}
          >
            <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
            Record Today's Journal
          </Button>

          {/* Secondary CTA - Analyse */}
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={isAnalyzing}
              aria-label="Analyze my journal"
              aria-expanded={showDropdown}
              aria-haspopup="menu"
              variant="outline"
              className="w-full h-12 font-medium rounded-2xl bg-card/80 backdrop-blur-sm border-border/50"
            >
              {isAnalyzing ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-foreground"
                  role="status"
                  aria-live="polite"
                >
                  Analysing...
                </motion.span>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-foreground" aria-hidden="true" />
                  <span className="text-foreground">Analyse My Journal</span>
                  <ChevronDown className={`ml-2 h-4 w-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} aria-hidden="true" />
                </>
              )}
            </Button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  role="menu"
                  className="absolute bottom-full mb-2 w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {(Object.keys(periodLabels) as AnalysisPeriod[]).map((period, index) => (
                    <motion.button
                      key={period}
                      role="menuitem"
                      onClick={() => handleAnalyze(period)}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors text-foreground font-medium flex items-center justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span>{periodLabels[period]}</span>
                      <span className="text-sm text-muted-foreground" aria-label={`${filterEntriesByPeriod(entries, period).length} entries`}>
                        {filterEntriesByPeriod(entries, period).length} entries
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
