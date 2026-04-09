import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Plus, 
  Feather, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Flame,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Lock,
  Unlock,
  Target,
  Trophy,
  Edit3,
  Trash2,
  Brain
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, differenceInDays, startOfDay, isToday } from "date-fns";
import { EntryEditor } from "./EntryEditor";
import { AnimatedGradient } from "./AnimatedGradient";
import { useAI } from "@/hooks/useAI";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
  mood?: "happy" | "calm" | "sad" | "excited" | "grateful" | "neutral";
}

interface InsightsResult {
  summary: string;
  dominantMood?: string;
  insights?: string[];
  encouragement?: string;
}

interface NewCalendarScreenProps {
  entries: Entry[];
  onSaveEntry: (entry: { title: string; content: string; mood?: Entry["mood"] }, date: Date, entryId?: string) => void;
  onDeleteEntry?: (entryId: string) => void;
  onEditorStateChange?: (isOpen: boolean) => void;
  openEditorForToday?: boolean;
  onOpenEditorForTodayHandled?: () => void;
  insights?: InsightsResult | null;
  loadingInsights?: boolean;
}

// Enhanced mood colors with gradients
const moodConfig = {
  happy: { 
    gradient: "from-amber-400 via-orange-400 to-yellow-400", 
    bg: "bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100",
    text: "text-amber-700",
    icon: "☀️",
    label: "Happy"
  },
  calm: { 
    gradient: "from-teal-400 via-cyan-400 to-blue-400", 
    bg: "bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100",
    text: "text-teal-700",
    icon: "🌊",
    label: "Calm"
  },
  grateful: { 
    gradient: "from-rose-400 via-pink-400 to-purple-400", 
    bg: "bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100",
    text: "text-rose-700",
    icon: "🌸",
    label: "Grateful"
  },
  excited: { 
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500", 
    bg: "bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100",
    text: "text-violet-700",
    icon: "⚡",
    label: "Excited"
  },
  sad: { 
    gradient: "from-slate-400 via-gray-400 to-zinc-400", 
    bg: "bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100",
    text: "text-slate-700",
    icon: "🌧️",
    label: "Reflective"
  },
  neutral: { 
    gradient: "from-emerald-400 via-green-400 to-teal-400", 
    bg: "bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100",
    text: "text-emerald-700",
    icon: "🌿",
    label: "Balanced"
  },
};

// Detect mood from entry content
const detectMood = (content: string, title?: string): Entry["mood"] => {
  const text = `${title || ""} ${content}`.toLowerCase();
  
  if (text.match(/happy|joy|excited|amazing|wonderful|awesome|fantastic|great/)) return "happy";
  if (text.match(/calm|peaceful|relaxed|serene|tranquil/)) return "calm";
  if (text.match(/grateful|thankful|blessed|appreciate|gratitude/)) return "grateful";
  if (text.match(/sad|depressed|lonely|hurt|cry|upset/)) return "sad";
  if (text.match(/excited|thrilled|energized|pumped|motivated/)) return "excited";
  return "neutral";
};

// Calculate streak
const calculateStreak = (entries: Entry[]): number => {
  if (entries.length === 0) return 0;
  
  const sortedDates = [...entries]
    .map(e => startOfDay(new Date(e.date)))
    .sort((a, b) => b.getTime() - a.getTime());
  
  const uniqueDates = [...new Set(sortedDates.map(d => d.toISOString()))].map(d => new Date(d));
  
  let streak = 0;
  const today = startOfDay(new Date());
  
  if (isSameDay(uniqueDates[0], today)) {
    streak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = uniqueDates[i - 1];
      const currDate = uniqueDates[i];
      
      if (differenceInDays(prevDate, currDate) === 1) {
        streak++;
      } else {
        break;
      }
    }
  } else if (differenceInDays(today, uniqueDates[0]) === 1) {
    streak = 0;
  } else {
    streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = uniqueDates[i - 1];
      const currDate = uniqueDates[i];
      
      if (differenceInDays(prevDate, currDate) === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  return streak;
};

// Get entries with mood
const getEntriesWithMood = (entries: Entry[]): Entry[] => {
  return entries.map(entry => ({
    ...entry,
    mood: entry.mood || detectMood(entry.content, entry.title)
  }));
};

export const NewCalendarScreen = ({ entries, onSaveEntry, onEditorStateChange, openEditorForToday, onOpenEditorForTodayHandled }: NewCalendarScreenProps) => {
  const { analyzeMood, analyzingMood } = useAI();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<Entry | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "today">("today");

  // Notify parent when editor state changes
  useEffect(() => {
    onEditorStateChange?.(showEditor);
  }, [showEditor, onEditorStateChange]);

  // Open editor for today when triggered from garden
  useEffect(() => {
    if (openEditorForToday) {
      setSelectedDate(new Date());
      setShowEditor(true);
      onOpenEditorForTodayHandled?.();
    }
  }, [openEditorForToday, onOpenEditorForTodayHandled]);

  const enhancedEntries = useMemo(() => getEntriesWithMood(entries), [entries]);
  
  const streak = useMemo(() => calculateStreak(enhancedEntries), [enhancedEntries]);
  const totalEntries = enhancedEntries.length;
  const entriesThisMonth = enhancedEntries.filter(e => isSameMonth(new Date(e.date), currentMonth)).length;
  
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const entriesThisWeek = enhancedEntries.filter(e => new Date(e.date) >= weekStart).length;
  const weekProgress = Math.min((entriesThisWeek / 7) * 100, 100);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOffset = monthStart.getDay();

  const getEntryForDate = (date: Date) => {
    return enhancedEntries.find(entry => isSameDay(new Date(entry.date), date));
  };

  const getEntriesForDate = (date: Date) => {
    return enhancedEntries.filter(entry => isSameDay(new Date(entry.date), date));
  };

  const handleDateClick = (date: Date) => {
    const existingEntries = getEntriesForDate(date);
    if (existingEntries.length > 0) {
      setViewingEntry(existingEntries[0]);
      setSelectedDate(date);
    } else {
      setSelectedDate(date);
      setShowEditor(true);
    }
  };

  const handleSaveEntry = useCallback(async (entry: { title: string; content: string }) => {
    if (selectedDate) {
      // Try AI mood detection first, fall back to keyword detection
      let mood: Entry["mood"];
      const aiResult = await analyzeMood(entry.content, entry.title);
      if (aiResult) {
        mood = aiResult.mood;
      } else {
        mood = detectMood(entry.content, entry.title);
      }
      const entryId = viewingEntry?.id;
      onSaveEntry({ ...entry, mood }, selectedDate, entryId);
      setShowEditor(false);
      setViewingEntry(null);
      setSelectedDate(null);
    }
  }, [selectedDate, viewingEntry, onSaveEntry, analyzeMood]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const moodDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    enhancedEntries.forEach(entry => {
      const mood = entry.mood || "neutral";
      distribution[mood] = (distribution[mood] || 0) + 1;
    });
    return distribution;
  }, [enhancedEntries]);

  const dominantMood = Object.entries(moodDistribution).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0] as Entry["mood"] || "neutral";

  return (
    <AnimatePresence mode="wait">
      {showEditor ? (
        <AnimatedGradient variant="calm" className="min-h-screen">
          <EntryEditor
            onBack={() => {
              setShowEditor(false);
              if (viewingEntry) {
                setViewingEntry(null);
              }
              setSelectedDate(null);
            }}
            onSave={handleSaveEntry}
            selectedDate={selectedDate}
            initialEntry={viewingEntry || undefined}
          />
        </AnimatedGradient>
      ) : viewingEntry ? (
        <AnimatedGradient variant="calm" className="min-h-screen">
          <motion.div
            key="entry-view"
            className="flex min-h-screen flex-col safe-area-top pb-28"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <header className="flex items-center justify-between px-4 py-4">
              <button
                onClick={() => {
                  setViewingEntry(null);
                  setSelectedDate(null);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/20 touch-target backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                {format(new Date(viewingEntry.date), "EEEE, MMMM d")}
              </span>
              <motion.button
                onClick={() => setShowEditor(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground touch-target"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit3 className="h-5 w-5" />
              </motion.button>
            </header>

            <div className="flex-1 px-6 py-4">
              {viewingEntry.mood && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${moodConfig[viewingEntry.mood].bg}`}
                >
                  <span className="text-lg">{moodConfig[viewingEntry.mood].icon}</span>
                  <span className={`text-sm font-medium ${moodConfig[viewingEntry.mood].text}`}>
                    Feeling {moodConfig[viewingEntry.mood].label}
                  </span>
                </motion.div>
              )}
              
              {viewingEntry.title && (
                <motion.h1 
                  className="text-3xl font-bold text-foreground mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {viewingEntry.title}
                </motion.h1>
              )}
              <motion.p 
                className="text-lg text-foreground/90 whitespace-pre-wrap leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {viewingEntry.content}
              </motion.p>
            </div>
          </motion.div>
        </AnimatedGradient>
      ) : (
        <AnimatedGradient variant="calm" className="min-h-screen">
          <motion.div
            key="calendar"
            className="flex min-h-screen flex-col safe-area-top pb-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Header - Gamification Section */}
            <motion.div
              className="px-4 pt-4 pb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-3 gap-3">
                {/* Streak Card */}
                <motion.div
                  className={`relative overflow-hidden rounded-2xl p-3 ${streak > 0 ? 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500' : 'bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-1">
                      <Flame className="h-4 w-4 text-white" />
                      <span className="text-xs font-medium text-white/90">Streak</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{streak}</p>
                    <p className="text-xs text-white/80">days</p>
                  </div>
                  {streak > 0 && (
                    <motion.div
                      className="absolute -right-2 -bottom-2 opacity-20"
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Flame className="h-16 w-16 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Total Entries Card */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-1">
                      <Trophy className="h-4 w-4 text-white" />
                      <span className="text-xs font-medium text-white/90">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{totalEntries}</p>
                    <p className="text-xs text-white/80">entries</p>
                  </div>
                  <motion.div
                    className="absolute -right-2 -bottom-2 opacity-20"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award className="h-16 w-16 text-white" />
                  </motion.div>
                </motion.div>

                {/* Weekly Progress Card */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="h-4 w-4 text-white" />
                      <span className="text-xs font-medium text-white/90">Weekly</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{entriesThisWeek}/7</p>
                    <p className="text-xs text-white/80">days</p>
                  </div>
                  <svg className="absolute -right-1 -bottom-1 w-14 h-14 opacity-30" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray={`${weekProgress}, 100`}
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Toggle Header */}
            <header className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
                  <button
                    onClick={() => setViewMode("today")}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      viewMode === "today"
                        ? "bg-foreground text-background shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      viewMode === "calendar"
                        ? "bg-foreground text-background shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Calendar
                  </button>
                </div>
                
                <motion.button
                  onClick={() => {
                    setSelectedDate(new Date());
                    setShowEditor(true);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              </div>
            </header>

            {viewMode === "today" ? (
              <div className="flex-1 px-4">
                {/* Hero Date Display */}
                <motion.div
                  className="mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {format(today, "EEEE")}
                    </p>
                    {streak > 0 && (
                      <motion.div 
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-medium"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Flame className="h-3 w-3" />
                        {streak} day streak!
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-baseline gap-3">
                    <motion.span 
                      className="text-6xl font-bold text-foreground tracking-tight"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                    >
                      {format(today, "dd")}
                    </motion.span>
                    <div className="flex flex-col">
                      <span className="text-2xl font-semibold text-foreground">
                        {format(today, "MMM").toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(today, "yyyy")}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Stats Row */}
                <motion.div
                  className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 whitespace-nowrap">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-foreground">{entriesThisMonth} this month</span>
                  </div>
                  
                  {dominantMood && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${moodConfig[dominantMood].bg}`}>
                      <span>{moodConfig[dominantMood].icon}</span>
                      <span className={`text-sm font-medium ${moodConfig[dominantMood].text}`}>
                        Mostly {moodConfig[dominantMood].label}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Today's Entries Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Feather className="h-5 w-5 text-primary" />
                      Today's Journal
                    </h3>
                    {getEntriesForDate(today).length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {getEntriesForDate(today).length} {getEntriesForDate(today).length === 1 ? 'entry' : 'entries'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {getEntriesForDate(today).length > 0 ? (
                      getEntriesForDate(today).map((entry, index) => {
                        const mood = entry.mood || "neutral";
                        return (
                          <motion.button
                            key={entry.id}
                            onClick={() => {
                              setViewingEntry(entry);
                              setSelectedDate(new Date(entry.date));
                            }}
                            className={`w-full p-5 rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow ${moodConfig[mood].bg}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.1, type: "spring" }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${moodConfig[mood].gradient} flex items-center justify-center text-2xl shadow-inner`}>
                                {moodConfig[mood].icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-lg font-semibold ${moodConfig[mood].text} truncate`}>
                                  {entry.title || "Journal Entry"}
                                </h4>
                                <p className={`text-sm mt-1 line-clamp-2 ${moodConfig[mood].text} opacity-70`}>
                                  {entry.content}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                  <span className={`text-xs ${moodConfig[mood].text} opacity-50`}>
                                    {format(new Date(entry.date), "h:mm a")}
                                  </span>
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/50 ${moodConfig[mood].text}`}>
                                    {moodConfig[mood].label}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })
                    ) : (
                      <motion.div
                        className="p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm text-center border-2 border-dashed border-border/50"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <motion.div
                          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Feather className="h-10 w-10 text-primary/60" />
                        </motion.div>
                        <p className="text-foreground font-medium mb-2">No entries yet today</p>
                        <p className="text-muted-foreground text-sm mb-4">Start your day with reflection</p>
                        <motion.button
                          onClick={() => {
                            setSelectedDate(new Date());
                            setShowEditor(true);
                          }}
                          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Write Your First Entry Today
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Recent Entries */}
                {enhancedEntries.filter(e => !isSameDay(new Date(e.date), today)).length > 0 && (
                  <motion.div
                    className="mt-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-foreground">Recent Entries</h3>
                      <button 
                        onClick={() => setViewMode("calendar")}
                        className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                      >
                        View all
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {enhancedEntries
                        .filter(e => !isSameDay(new Date(e.date), today))
                        .slice(0, 3)
                        .map((entry, index) => {
                          const mood = entry.mood || "neutral";
                          return (
                            <motion.button
                              key={entry.id}
                              onClick={() => {
                                setViewingEntry(entry);
                                setSelectedDate(new Date(entry.date));
                              }}
                              className="w-full p-4 rounded-xl bg-card/70 backdrop-blur-sm border border-border/50 text-left hover:bg-muted/50 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${moodConfig[mood].gradient} text-lg`}>
                                  {moodConfig[mood].icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {entry.title || "Untitled Entry"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(entry.date), "MMM d, yyyy")}
                                  </p>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${moodConfig[mood].bg} ${moodConfig[mood].text}`}>
                                  {moodConfig[mood].label}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex-1 px-4">
                {/* Month Navigator */}
                <motion.div
                  className="flex items-center justify-center gap-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                  </motion.button>
                  
                  <div className="text-center min-w-[120px]">
                    <p className="text-lg font-bold text-foreground">
                      {format(currentMonth, "MMMM yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entriesThisMonth} {entriesThisMonth === 1 ? 'entry' : 'entries'}
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="h-5 w-5 text-foreground" />
                  </motion.button>
                </motion.div>

                {/* Week Headers */}
                <div className="grid grid-cols-7 mb-3">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2 uppercase tracking-wider">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Calendar Days - Enhanced */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                  {Array.from({ length: startDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {monthDays.map((day, index) => {
                    const entries = getEntriesForDate(day);
                    const hasEntry = entries.length > 0;
                    const isTodayDate = isToday(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const dayMood = entries[0]?.mood || "neutral";

                    return (
                      <motion.button
                        key={day.toString()}
                        onClick={() => handleDateClick(day)}
                        className={`
                          relative aspect-square rounded-xl flex flex-col items-center justify-center gap-1
                          ${isTodayDate ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : ""}
                          ${!isTodayDate && hasEntry ? "bg-gradient-to-br from-muted/80 to-muted/40" : ""}
                          ${!isTodayDate && !hasEntry ? "hover:bg-muted/30" : ""}
                          ${!isCurrentMonth ? "opacity-30" : ""}
                        `}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`text-sm font-semibold ${
                          isTodayDate ? "text-primary-foreground" : "text-foreground"
                        }`}>
                          {format(day, "d")}
                        </span>
                        
                        {hasEntry && (
                          <div className="flex gap-0.5 items-center">
                            {entries.length === 1 ? (
                              <span className="text-[10px] leading-none">{moodConfig[entries[0].mood || "neutral"].icon}</span>
                            ) : (
                              <>
                                {entries.slice(0, 3).map((entry, i) => {
                                  const mood = entry.mood || "neutral";
                                  return (
                                    <motion.div
                                      key={i}
                                      className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${moodConfig[mood].gradient}`}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.3 + i * 0.1 }}
                                    />
                                  );
                                })}
                                {entries.length > 3 && (
                                  <span className="text-[8px] text-muted-foreground">+</span>
                                )}
                              </>
                            )}
                          </div>
                        )}

                        {isTodayDate && !hasEntry && (
                          <motion.div
                            className="absolute inset-1 rounded-xl border-2 border-dashed border-primary/30"
                            animate={{ rotate: [0, 180, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected Month Stats */}
                <motion.div
                  className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 backdrop-blur-sm border border-border/50 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {format(currentMonth, "MMMM")} Insights
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-card/50">
                      <p className="text-xs text-muted-foreground mb-1">Total Entries</p>
                      <p className="text-2xl font-bold text-foreground">{entriesThisMonth}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card/50">
                      <p className="text-xs text-muted-foreground mb-1">Writing Days</p>
                      <p className="text-2xl font-bold text-foreground">
                        {new Set(enhancedEntries
                          .filter(e => isSameMonth(new Date(e.date), currentMonth))
                          .map(e => format(new Date(e.date), "yyyy-MM-dd"))
                        ).size}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatedGradient>
      )}
    </AnimatePresence>
  );
};

export default NewCalendarScreen;
