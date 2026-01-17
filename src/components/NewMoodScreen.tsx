import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { Face3D, MoodType } from "./Face3D";
import { Button } from "./ui/button";
import { AnimatedGradient } from "./AnimatedGradient";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
}

interface NewMoodScreenProps {
  entries: Entry[];
}

type AnalysisPeriod = "today" | "week" | "month" | "year";

const periodLabels: Record<AnalysisPeriod, string> = {
  today: "Today's Entry",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

// Simple sentiment analysis based on keywords
const analyzeSentiment = (entries: Entry[]): MoodType => {
  if (entries.length === 0) return "neutral";
  
  const allText = entries.map(e => `${e.title || ""} ${e.content}`).join(" ").toLowerCase();
  
  const happyWords = ["happy", "joy", "grateful", "wonderful", "amazing", "love", "excited", "great", "beautiful", "blessed", "thankful", "awesome", "fantastic"];
  const sadWords = ["sad", "depressed", "lonely", "hurt", "crying", "tears", "miss", "lost", "grief", "heartbreak", "alone", "empty"];
  const excitedWords = ["excited", "thrilled", "amazing", "incredible", "fantastic", "adventure", "new", "celebrate", "achievement", "success", "victory"];
  const anxiousWords = ["anxious", "worried", "stress", "nervous", "fear", "panic", "overwhelmed", "scared", "uncertain", "doubt", "pressure"];
  const calmWords = ["calm", "peaceful", "serene", "relaxed", "quiet", "tranquil", "mindful", "meditation", "stillness", "content", "balanced"];
  
  const scores = {
    happy: happyWords.filter(w => allText.includes(w)).length,
    sad: sadWords.filter(w => allText.includes(w)).length,
    excited: excitedWords.filter(w => allText.includes(w)).length,
    anxious: anxiousWords.filter(w => allText.includes(w)).length,
    calm: calmWords.filter(w => allText.includes(w)).length,
  };
  
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return "neutral";
  
  const topMood = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as MoodType;
  return topMood || "neutral";
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

const allMoods: MoodType[] = ["neutral", "happy", "sad", "excited", "anxious", "calm"];

export const NewMoodScreen = ({ entries }: NewMoodScreenProps) => {
  const [mood, setMood] = useState<MoodType>("neutral");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<AnalysisPeriod | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setSelectedPeriod(period);
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    
    // Cycle through all moods during analysis
    const cycleDuration = 300; // ms per mood
    const totalCycles = 2;
    
    for (let cycle = 0; cycle < totalCycles; cycle++) {
      for (const moodOption of allMoods) {
        setMood(moodOption);
        await new Promise(resolve => setTimeout(resolve, cycleDuration));
      }
    }
    
    // Final analysis
    const filteredEntries = filterEntriesByPeriod(entries, period);
    const detectedMood = analyzeSentiment(filteredEntries);
    setMood(detectedMood);
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  return (
    <AnimatedGradient variant="calm" className="min-h-screen">
      <motion.div
        className="flex min-h-screen flex-col safe-area-top pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <header className="px-6 pt-8 pb-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">My Mood</h1>
            <p className="text-sm text-muted-foreground mt-1">How are you feeling?</p>
          </div>
        </header>

        {/* Main Content - 3D Face */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-4">
          <Face3D mood={mood} isAnalyzing={isAnalyzing} />

          <motion.div
            className="mt-10 w-full max-w-xs relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            ref={dropdownRef}
          >
            <Button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={isAnalyzing}
              className="w-full h-14 text-lg font-medium rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              {isAnalyzing ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Analyzing...
                </motion.span>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {hasAnalyzed ? "Analyse Again" : "Analyse My Mood"}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </>
              )}
            </Button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="absolute top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
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

            {hasAnalyzed && selectedPeriod && (
              <motion.p
                className="mt-4 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Based on {filterEntriesByPeriod(entries, selectedPeriod).length} {filterEntriesByPeriod(entries, selectedPeriod).length === 1 ? "entry" : "entries"} from {periodLabels[selectedPeriod].toLowerCase()}
              </motion.p>
            )}

            {entries.length === 0 && (
              <motion.p
                className="mt-4 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Start journaling to analyse your mood
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatedGradient>
  );
};
