import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { GardenHomeScreen } from "./GardenHomeScreen";
import { NewCalendarScreen } from "./NewCalendarScreen";
import { ProfileScreen } from "./ProfileScreen";
import { BottomNav, NavTab } from "./BottomNav";
import { storage } from "@/lib/storage";
import { Entry } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

interface HomeScreenProps {
  onLogout: () => void;
}

export const HomeScreen = ({ onLogout }: HomeScreenProps) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeTab, setActiveTab] = useState<NavTab>("mood");
  const [isInitialized, setIsInitialized] = useState(false);
  const { logout } = useAuth();

  // Initialize entries from storage
  useEffect(() => {
    try {
      const savedEntries = storage.getEntries();
      setEntries(savedEntries);
      setIsInitialized(true);
      console.log('[v0] Initialized with', savedEntries.length, 'entries');
    } catch (error) {
      console.error('[v0] Failed to initialize entries:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save entries to storage whenever they change
  useEffect(() => {
    if (isInitialized && entries.length > 0) {
      storage.saveEntries(entries);
    }
  }, [entries, isInitialized]);

  const handleSaveEntry = useCallback(
    (entry: { title: string; content: string }, date: Date) => {
      try {
        const wordCount = entry.content.trim().split(/\s+/).length;
        const quality = wordCount < 50 ? 'short' : wordCount < 200 ? 'medium' : 'long';
        
        const newEntry: Entry = {
          id: `entry_${Date.now()}`,
          date: date.toISOString(),
          title: entry.title || undefined,
          content: entry.content,
          wordCount,
          quality,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setEntries(prev => [newEntry, ...prev]);
        console.log('[v0] Entry saved:', newEntry.id);
      } catch (error) {
        console.error('[v0] Failed to save entry:', error);
      }
    },
    []
  );

  const handleRecordEntry = useCallback(() => {
    setActiveTab("calendar");
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    onLogout();
  }, [logout, onLogout]);

  const totalDays = new Set(entries.map(e => new Date(e.date).toDateString())).size;

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {activeTab === "mood" && isInitialized && (
          <GardenHomeScreen
            key="mood"
            entries={entries}
            onRecordEntry={handleRecordEntry}
          />
        )}
        {activeTab === "calendar" && isInitialized && (
          <NewCalendarScreen
            key="calendar"
            entries={entries}
            onSaveEntry={handleSaveEntry}
          />
        )}
        {activeTab === "profile" && isInitialized && (
          <ProfileScreen
            key="profile"
            onLogout={handleLogout}
            totalEntries={entries.length}
            totalDays={totalDays}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
