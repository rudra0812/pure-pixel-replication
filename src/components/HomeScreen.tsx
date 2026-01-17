import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { NewMoodScreen } from "./NewMoodScreen";
import { NewCalendarScreen } from "./NewCalendarScreen";
import { ProfileScreen } from "./ProfileScreen";
import { BottomNav, NavTab } from "./BottomNav";

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
  const [activeTab, setActiveTab] = useState<NavTab>("mood");

  const handleSaveEntry = (entry: { title: string; content: string }, date: Date) => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      date: date,
      title: entry.title || undefined,
      content: entry.content,
    };
    setEntries([newEntry, ...entries]);
  };

  const totalDays = new Set(entries.map(e => new Date(e.date).toDateString())).size;

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {activeTab === "mood" && (
          <NewMoodScreen
            key="mood"
            entries={entries}
          />
        )}
        {activeTab === "calendar" && (
          <NewCalendarScreen
            key="calendar"
            entries={entries}
            onSaveEntry={handleSaveEntry}
          />
        )}
        {activeTab === "profile" && (
          <ProfileScreen
            key="profile"
            onLogout={onLogout}
            totalEntries={entries.length}
            totalDays={totalDays}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
