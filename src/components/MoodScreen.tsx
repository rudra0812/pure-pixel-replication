import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Sparkles, Feather } from "lucide-react";
import { MoodEmoji, MoodType } from "./MoodEmoji";
import { Button } from "./ui/button";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
}

interface MoodScreenProps {
  entries: Entry[];
  onOpenCalendar: () => void;
}

// Simple sentiment analysis based on keywords
const analyzeSentiment = (entries: Entry[]): MoodType => {
  if (entries.length === 0) return "neutral";
  
  const recentEntries = entries.slice(0, 5); // Analyze last 5 entries
  const allText = recentEntries.map(e => `${e.title || ""} ${e.content}`).join(" ").toLowerCase();
  
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

export const MoodScreen = ({ entries, onOpenCalendar }: MoodScreenProps) => {
  const [mood, setMood] = useState<MoodType>("neutral");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    
    // Simulate analysis with delay for visual effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const detectedMood = analyzeSentiment(entries);
    setMood(detectedMood);
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-background safe-area-top safe-area-bottom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="px-4 pb-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Feather className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-title text-foreground">My Mood</h1>
          </div>
          <motion.button
            onClick={onOpenCalendar}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <MoodEmoji mood={mood} size={220} isAnalyzing={isAnalyzing} />
        </motion.div>

        <motion.div
          className="mt-12 w-full max-w-xs"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleAnalyze}
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
              </>
            )}
          </Button>

          {hasAnalyzed && (
            <motion.p
              className="mt-4 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Based on your recent {Math.min(entries.length, 5)} journal {entries.length === 1 ? "entry" : "entries"}
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

      {/* Stats Footer */}
      <motion.div
        className="px-6 pb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-around py-4 rounded-2xl bg-card border border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Total Entries</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {entries.filter(e => {
                const today = new Date();
                const entryDate = new Date(e.date);
                return entryDate.toDateString() === today.toDateString();
              }).length}
            </p>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {new Set(entries.map(e => new Date(e.date).toDateString())).size}
            </p>
            <p className="text-xs text-muted-foreground">Days Logged</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
