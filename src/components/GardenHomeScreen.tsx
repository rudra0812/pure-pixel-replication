import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Plus, ChevronDown, Droplets } from "lucide-react";
import { Button } from "./ui/button";
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

// Determine growth stage based on entry count
const getGrowthStage = (entryCount: number): GrowthStage => {
  if (entryCount === 0) return "seed";
  if (entryCount < 3) return "rooted";
  if (entryCount < 7) return "sprouting";
  if (entryCount < 15) return "growing";
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

  const growthStage = getGrowthStage(entries.length);

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
      className="relative min-h-screen safe-area-top overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Garden Scene - Full height */}
      <div className="absolute inset-0">
        <GardenScene
          weatherMood={weatherMood}
          growthStage={growthStage}
          plantName={plantName}
          isAnalyzing={isAnalyzing}
          isWatering={isWatering}
          waterGrowthPulse={waterGrowthPulse}
        />

        {/* Water Button - Right side, styled and interactive */}
        <motion.div
          className="absolute right-4 top-1/3 z-30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <motion.button
            onClick={handleWater}
            disabled={isWatering}
            className="relative p-3.5 rounded-full shadow-xl border-2 overflow-hidden"
            style={{
              background: isWatering 
                ? "linear-gradient(135deg, hsl(200 80% 55%), hsl(210 85% 45%))" 
                : "linear-gradient(135deg, hsl(200 70% 60%), hsl(210 75% 50%))",
              borderColor: isWatering ? "hsl(200 80% 70%)" : "hsl(200 60% 75%)",
            }}
            whileHover={{ scale: 1.2, boxShadow: "0 0 20px hsl(200 80% 60% / 0.5)" }}
            whileTap={{ scale: 0.9 }}
            animate={isWatering ? { 
              rotate: [0, -15, 15, -15, 15, 0],
              y: [0, -5, 0],
            } : {}}
            transition={{ duration: 0.5, repeat: isWatering ? Infinity : 0 }}
          >
            <Droplets 
              className="h-6 w-6 text-white drop-shadow-sm" 
            />
            {/* Ripple ring on hover/active */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Water drops effect */}
            {isWatering && (
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{ left: (i - 1) * 6, background: "hsl(200 80% 75%)" }}
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
        </motion.div>
      </div>

      {/* Action Buttons - Plant sits on top of this area */}
      <div className="absolute bottom-[6.5rem] left-0 right-0 px-6 z-20">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          {/* Roots behind the button */}
          <div className="relative">
            <svg 
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-12 z-0 pointer-events-none" 
              viewBox="0 0 200 50"
            >
              <motion.path
                d="M100 0 Q95 15 80 30 Q70 40 55 48"
                stroke="hsl(25 40% 28%)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                animate={{ d: ["M100 0 Q95 15 80 30 Q70 40 55 48", "M100 0 Q95 15 82 32 Q72 42 58 48", "M100 0 Q95 15 80 30 Q70 40 55 48"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M100 0 Q105 15 120 30 Q130 40 145 48"
                stroke="hsl(25 40% 28%)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                animate={{ d: ["M100 0 Q105 15 120 30 Q130 40 145 48", "M100 0 Q105 15 118 32 Q128 42 142 48", "M100 0 Q105 15 120 30 Q130 40 145 48"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M100 0 Q98 18 90 35 Q85 45 75 48"
                stroke="hsl(30 35% 24%)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <motion.path
                d="M100 0 Q102 18 110 35 Q115 45 125 48"
                stroke="hsl(30 35% 24%)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Small root tips */}
              <motion.path d="M100 0 Q100 20 100 48" stroke="hsl(25 38% 26%)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>

            {/* Primary CTA - Record Journal with earthy tones */}
            <Button
              onClick={onRecordEntry}
              className="relative w-full h-14 text-lg font-medium rounded-2xl shadow-lg z-10 border-2"
              style={{
                background: "linear-gradient(135deg, hsl(30 50% 28%), hsl(25 45% 22%), hsl(30 40% 25%))",
                borderColor: "hsl(30 40% 35%)",
                color: "hsl(45 80% 85%)",
              }}
            >
              <Plus className="mr-2 h-5 w-5" />
              Record Today's Journal
            </Button>
          </div>

          {/* Secondary CTA - Analyse */}
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={isAnalyzing}
              variant="outline"
              className="w-full h-12 font-medium rounded-2xl bg-card/80 backdrop-blur-sm border-border/50"
            >
              {isAnalyzing ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-foreground"
                >
                  Analysing...
                </motion.span>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-foreground" />
                  <span className="text-foreground">Analyse My Journal</span>
                  <ChevronDown className={`ml-2 h-4 w-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </>
              )}
            </Button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="absolute bottom-full mb-2 w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {(Object.keys(periodLabels) as AnalysisPeriod[]).map((period, index) => (
                    <motion.button
                      key={period}
                      onClick={() => handleAnalyze(period)}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors text-foreground font-medium flex items-center justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span>{periodLabels[period]}</span>
                      <span className="text-sm text-muted-foreground">
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
