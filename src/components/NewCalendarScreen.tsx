import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Feather, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { EntryEditor } from "./EntryEditor";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
}

interface NewCalendarScreenProps {
  entries: Entry[];
  onSaveEntry: (entry: { title: string; content: string }, date: Date) => void;
}

// Color palette for date cards (inspired by reference)
const dateCardColors = [
  { bg: "bg-amber-100", text: "text-amber-900", accent: "bg-amber-200" },
  { bg: "bg-purple-100", text: "text-purple-900", accent: "bg-purple-200" },
  { bg: "bg-rose-100", text: "text-rose-900", accent: "bg-rose-200" },
  { bg: "bg-teal-100", text: "text-teal-900", accent: "bg-teal-200" },
  { bg: "bg-sky-100", text: "text-sky-900", accent: "bg-sky-200" },
];

export const NewCalendarScreen = ({ entries, onSaveEntry }: NewCalendarScreenProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<Entry | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "today">("today");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOffset = monthStart.getDay();

  const getEntryForDate = (date: Date) => {
    return entries.find(entry => isSameDay(new Date(entry.date), date));
  };

  const getEntriesForDate = (date: Date) => {
    return entries.filter(entry => isSameDay(new Date(entry.date), date));
  };

  const handleDateClick = (date: Date) => {
    const existingEntry = getEntryForDate(date);
    if (existingEntry) {
      setViewingEntry(existingEntry);
      setSelectedDate(date);
    } else {
      setSelectedDate(date);
      setShowEditor(true);
    }
  };

  const handleSaveEntry = (entry: { title: string; content: string }) => {
    if (selectedDate) {
      onSaveEntry(entry, selectedDate);
      setShowEditor(false);
      setSelectedDate(null);
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  // Get upcoming days with entries
  const getUpcomingDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date,
        entries: getEntriesForDate(date),
        colorIndex: i % dateCardColors.length,
      });
    }
    return days;
  };

  return (
    <AnimatePresence mode="wait">
      {showEditor ? (
        <EntryEditor
          key="editor"
          onBack={() => {
            setShowEditor(false);
            setSelectedDate(null);
          }}
          onSave={handleSaveEntry}
          selectedDate={selectedDate}
        />
      ) : viewingEntry ? (
        <motion.div
          key="entry-view"
          className="flex min-h-screen flex-col bg-background safe-area-top pb-28"
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
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <span className="text-sm text-muted-foreground">
              {format(new Date(viewingEntry.date), "EEEE, MMMM d")}
            </span>
            <div className="w-11" />
          </header>

          <div className="flex-1 px-6 py-4">
            {viewingEntry.title && (
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {viewingEntry.title}
              </h1>
            )}
            <p className="text-body text-foreground whitespace-pre-wrap leading-relaxed">
              {viewingEntry.content}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="calendar"
          className="flex min-h-screen flex-col bg-background safe-area-top pb-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Toggle Header */}
          <header className="px-4 pt-6 pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setViewMode("today")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === "today"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === "calendar"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => {
                  setSelectedDate(new Date());
                  setShowEditor(true);
                }}
                className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
              >
                <Plus className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </header>

          {viewMode === "today" ? (
            /* Today View - Like reference design */
            <div className="flex-1 px-4">
              {/* Date Display */}
              <motion.div
                className="mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <p className="text-sm text-muted-foreground">{format(today, "EEEE")}</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-bold text-foreground">
                    {format(today, "dd.MM")}
                  </span>
                </div>
                <span className="text-4xl font-bold text-foreground">
                  {format(today, "MMM").toUpperCase()}
                </span>
              </motion.div>

              {/* Today's Entries Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Today's Journal</h3>
                </div>

                <div className="space-y-3">
                  {getEntriesForDate(today).length > 0 ? (
                    getEntriesForDate(today).map((entry, index) => (
                      <motion.button
                        key={entry.id}
                        onClick={() => {
                          setViewingEntry(entry);
                          setSelectedDate(new Date(entry.date));
                        }}
                        className={`w-full p-4 rounded-2xl ${dateCardColors[index % dateCardColors.length].bg} text-left`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h4 className={`text-lg font-semibold ${dateCardColors[index % dateCardColors.length].text}`}>
                          {entry.title || "Journal Entry"}
                        </h4>
                        <p className={`text-sm mt-1 line-clamp-2 ${dateCardColors[index % dateCardColors.length].text} opacity-80`}>
                          {entry.content}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs ${dateCardColors[index % dateCardColors.length].text} opacity-60`}>
                            {format(new Date(entry.date), "h:mm a")}
                          </span>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <motion.div
                      className="p-6 rounded-2xl bg-muted/50 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Feather className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No entries today</p>
                      <button
                        onClick={() => {
                          setSelectedDate(new Date());
                          setShowEditor(true);
                        }}
                        className="mt-3 text-sm text-primary font-medium"
                      >
                        Write your first entry
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Recent Entries */}
              {entries.filter(e => !isSameDay(new Date(e.date), today)).length > 0 && (
                <motion.div
                  className="mt-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h3>
                  <div className="space-y-2">
                    {entries
                      .filter(e => !isSameDay(new Date(e.date), today))
                      .slice(0, 3)
                      .map((entry, index) => (
                        <motion.button
                          key={entry.id}
                          onClick={() => {
                            setViewingEntry(entry);
                            setSelectedDate(new Date(entry.date));
                          }}
                          className="w-full p-4 rounded-xl bg-card border border-border text-left hover:bg-muted transition-colors"
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Feather className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {entry.title || "Untitled Entry"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(entry.date), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Calendar View */
            <div className="flex-1 px-4">
              {/* Month Navigator */}
              <motion.div
                className="flex items-center justify-center gap-6 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {format(subMonths(currentMonth, 1), "MMM").toUpperCase()}
                </button>
                <div className="flex items-center gap-2">
                  <ChevronLeft 
                    className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  />
                  <span className="text-lg font-bold text-foreground min-w-[60px] text-center">
                    {format(currentMonth, "MMM").toUpperCase()}
                  </span>
                  <ChevronRight 
                    className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  />
                </div>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {format(addMonths(currentMonth, 1), "MMM").toUpperCase()}
                </button>
              </motion.div>

              {/* Week Headers */}
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {Array.from({ length: startDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {monthDays.map((day, index) => {
                  const entry = getEntryForDate(day);
                  const isToday = isSameDay(day, new Date());
                  const hasEntry = !!entry;

                  return (
                    <motion.button
                      key={day.toString()}
                      onClick={() => handleDateClick(day)}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 relative
                        ${isToday ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                        ${!isSameMonth(day, currentMonth) ? "opacity-30" : ""}
                      `}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.005 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`text-sm font-medium ${isToday ? "text-primary-foreground" : "text-foreground"}`}>
                        {format(day, "d")}
                      </span>
                      
                      {hasEntry && (
                        <motion.div
                          className={`absolute bottom-1 flex h-4 w-4 items-center justify-center rounded-md ${
                            isToday ? "bg-primary-foreground/30" : "bg-primary"
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Feather className={`h-2.5 w-2.5 ${isToday ? "text-primary-foreground" : "text-primary-foreground"}`} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Month's Date Cards - Reference style */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {getUpcomingDays().slice(0, 5).map(({ date, entries: dayEntries, colorIndex }) => (
                  <motion.div
                    key={date.toString()}
                    className={`p-4 rounded-2xl ${dateCardColors[colorIndex].bg}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-xs ${dateCardColors[colorIndex].text} opacity-70`}>
                          {format(date, "EEEE")}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-3xl font-bold ${dateCardColors[colorIndex].text}`}>
                            {format(date, "d")}
                          </span>
                          <span className={`text-lg font-bold ${dateCardColors[colorIndex].text}`}>
                            {format(date, "MMM").toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {dayEntries.length > 0 ? (
                          dayEntries.slice(0, 3).map((entry, i) => (
                            <button
                              key={entry.id}
                              onClick={() => {
                                setViewingEntry(entry);
                                setSelectedDate(new Date(entry.date));
                              }}
                              className={`px-2 py-1 rounded-md text-xs font-medium ${dateCardColors[colorIndex].accent} ${dateCardColors[colorIndex].text}`}
                            >
                              {entry.title?.slice(0, 8) || "Entry"}
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedDate(date);
                              setShowEditor(true);
                            }}
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${dateCardColors[colorIndex].accent}`}
                          >
                            <Plus className={`h-3 w-3 ${dateCardColors[colorIndex].text}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
