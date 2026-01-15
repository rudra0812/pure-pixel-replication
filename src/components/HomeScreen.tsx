import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Settings, Feather, Search } from "lucide-react";
import { EntryCard } from "./EntryCard";
import { EntryEditor } from "./EntryEditor";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
}

interface HomeScreenProps {
  onLogout: () => void;
}

// Sample entries for demo
const sampleEntries: Entry[] = [
  {
    id: "1",
    date: new Date(),
    title: "A moment of gratitude",
    content: "Today I woke up feeling grateful for the small things. The morning sunlight streaming through my window, the aroma of fresh coffee, and the quiet moments before the day begins. It's easy to overlook these simple pleasures, but they make life beautiful.",
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000),
    content: "Had a wonderful conversation with an old friend today. We talked for hours about our dreams, fears, and everything in between. It reminded me of the importance of nurturing relationships and staying connected with the people who matter.",
    hasMedia: true,
  },
  {
    id: "3",
    date: new Date(Date.now() - 86400000 * 3),
    title: "New beginnings",
    content: "Started reading a new book today. There's something magical about the first few pages of a story, full of possibilities and unknown adventures. I'm excited to see where this journey takes me.",
  },
];

export const HomeScreen = ({ onLogout }: HomeScreenProps) => {
  const [entries, setEntries] = useState<Entry[]>(sampleEntries);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSaveEntry = (entry: { title: string; content: string }) => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date(),
      title: entry.title || undefined,
      content: entry.content,
    };
    setEntries([newEntry, ...entries]);
    setShowEditor(false);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence mode="wait">
      {showEditor ? (
        <EntryEditor
          key="editor"
          onBack={() => setShowEditor(false)}
          onSave={handleSaveEntry}
        />
      ) : (
        <motion.div
          key="home"
          className="flex min-h-screen flex-col bg-background safe-area-top safe-area-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <header className="px-4 pb-4 pt-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Feather className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-title text-foreground">Journal</h1>
              </div>
              <motion.button
                onClick={onLogout}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </header>

          {/* Entries List */}
          <div className="flex-1 px-4 pb-24">
            {filteredEntries.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center py-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Feather className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  {searchQuery ? "No entries found" : "Your journal is empty"}
                </h2>
                <p className="max-w-xs text-body text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term"
                    : "Start writing to capture your thoughts and memories"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry, index) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    index={index}
                    onClick={() => {}}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <motion.button
            onClick={() => setShowEditor(true)}
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
