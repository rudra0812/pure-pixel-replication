import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Plus, Feather, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { EntryEditor } from "./EntryEditor";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
}

interface CalendarScreenProps {
  entries: Entry[];
  onBack: () => void;
  onSaveEntry: (entry: { title: string; content: string }, date: Date) => void;
}

export const CalendarScreen = ({ entries, onBack, onSaveEntry }: CalendarScreenProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<Entry | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week offset (0 = Sunday)
  const startDayOffset = monthStart.getDay();

  // Check if a date has an entry
  const getEntryForDate = (date: Date) => {
    return entries.find(entry => isSameDay(new Date(entry.date), date));
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
          className="flex min-h-screen flex-col bg-background safe-area-top safe-area-bottom"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <button
              onClick={() => {
                setViewingEntry(null);
                setSelectedDate(null);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <span className="text-secondary text-muted-foreground">
              {format(new Date(viewingEntry.date), "EEEE, MMMM d, yyyy")}
            </span>
            <div className="w-11" />
          </header>

          {/* Entry Content */}
          <div className="flex-1 px-4 py-6">
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
          className="flex min-h-screen flex-col bg-background safe-area-top safe-area-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <header className="px-4 pb-4 pt-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <h1 className="text-title text-foreground">Calendar</h1>
              <div className="w-11" />
            </div>

            {/* Month Navigator */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </motion.button>
              <h2 className="text-xl font-semibold text-foreground">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <motion.button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </motion.button>
            </div>
          </header>

          {/* Calendar Grid */}
          <div className="flex-1 px-4">
            {/* Week day headers */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Actual days */}
              {monthDays.map((day, index) => {
                const entry = getEntryForDate(day);
                const isToday = isSameDay(day, new Date());
                const hasEntry = !!entry;

                return (
                  <motion.button
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center gap-1 relative
                      ${isToday ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                      ${!isSameMonth(day, currentMonth) ? "opacity-30" : ""}
                    `}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`text-sm font-medium ${isToday ? "text-primary-foreground" : "text-foreground"}`}>
                      {format(day, "d")}
                    </span>
                    
                    {/* Entry indicator - App icon */}
                    {hasEntry && (
                      <motion.div
                        className={`absolute bottom-1 flex h-4 w-4 items-center justify-center rounded-md ${
                          isToday ? "bg-primary-foreground/30" : "bg-primary"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      >
                        <Feather className={`h-2.5 w-2.5 ${isToday ? "text-primary-foreground" : "text-primary-foreground"}`} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Entries for selected month */}
            <motion.div
              className="mt-8 mb-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Entries this month ({entries.filter(e => isSameMonth(new Date(e.date), currentMonth)).length})
              </h3>
              <div className="space-y-2">
                {entries
                  .filter(e => isSameMonth(new Date(e.date), currentMonth))
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((entry, index) => (
                    <motion.button
                      key={entry.id}
                      onClick={() => {
                        setViewingEntry(entry);
                        setSelectedDate(new Date(entry.date));
                      }}
                      className="w-full p-3 rounded-xl bg-card border border-border text-left hover:bg-muted transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
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
          </div>

          {/* Floating Action Button */}
          <motion.button
            onClick={() => {
              setSelectedDate(new Date());
              setShowEditor(true);
            }}
            className="fab-button fixed bottom-8 right-6 z-50 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-6 w-6 text-white" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
