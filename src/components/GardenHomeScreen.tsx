import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Plus, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { GardenScene } from "./garden/GardenScene";
import { GrowthStage } from "./garden/Plant";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [plantName] = useState("My Journey"); // Could be customizable later
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
        />
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="absolute bottom-28 left-0 right-0 px-6 z-20">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          {/* Primary CTA - Record Journal */}
          <Button
            onClick={onRecordEntry}
            className="w-full h-14 text-lg font-medium rounded-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, hsl(130 50% 40%), hsl(140 45% 35%))",
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            Record Today's Journal
          </Button>

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
