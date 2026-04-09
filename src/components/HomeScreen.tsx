import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GardenHomeScreen } from "./GardenHomeScreen";
import { NewCalendarScreen } from "./NewCalendarScreen";
import { ProfileScreen } from "./ProfileScreen";
import { BottomNav, NavTab } from "./BottomNav";
import { AIChatScreen } from "./AIChatScreen";
import { useEntries } from "@/hooks/useEntries";
import { useAuth } from "@/hooks/useAuth";
import { useAI } from "@/hooks/useAI";

interface HomeScreenProps {
  onLogout: () => void;
}

export const HomeScreen = ({ onLogout }: HomeScreenProps) => {
  const { entries, saveEntry, deleteEntry } = useEntries();
  const { user } = useAuth();
  const { getPrompts, loadingPrompts, getInsights, loadingInsights } = useAI();
  const [activeTab, setActiveTab] = useState<NavTab>("mood");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [openEditorForToday, setOpenEditorForToday] = useState(false);
  const [aiPrompts, setAiPrompts] = useState<{ text: string; category: string }[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (entries.length > 0) {
      getPrompts(entries.slice(0, 5)).then(setAiPrompts);
    }
  }, [entries.length]);

  useEffect(() => {
    if (entries.length >= 3 && !insights) {
      getInsights(entries.slice(0, 20), "week").then(setInsights);
    }
  }, [entries.length]);

  const handleRecordEntry = () => {
    setActiveTab("calendar");
    setOpenEditorForToday(true);
  };

  const handlePromptTap = (prompt: string) => {
    setActiveTab("calendar");
    setOpenEditorForToday(true);
  };

  const totalDays = new Set(entries.map(e => new Date(e.date).toDateString())).size;

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatePresence>
        {activeTab === "mood" && (
          <motion.div key="mood" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}>
            <GardenHomeScreen entries={entries} onRecordEntry={handleRecordEntry} aiPrompts={aiPrompts} loadingPrompts={loadingPrompts} onPromptTap={handlePromptTap} onOpenChat={() => setShowChat(true)} />
          </motion.div>
        )}
        {activeTab === "calendar" && (
          <motion.div key="calendar" className="absolute inset-0 overflow-y-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}>
            <NewCalendarScreen entries={entries} onSaveEntry={saveEntry} onDeleteEntry={deleteEntry} onEditorStateChange={setIsEditorOpen} openEditorForToday={openEditorForToday} onOpenEditorForTodayHandled={() => setOpenEditorForToday(false)} insights={insights} loadingInsights={loadingInsights} />
          </motion.div>
        )}
        {activeTab === "profile" && (
          <motion.div key="profile" className="absolute inset-0 overflow-y-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}>
            <ProfileScreen onLogout={onLogout} totalEntries={entries.length} totalDays={totalDays} entries={entries} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isEditorOpen && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}

      <AIChatScreen isOpen={showChat} onClose={() => setShowChat(false)} entries={entries} />
    </div>
  );
};
