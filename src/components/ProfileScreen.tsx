import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Bell, Moon, LogOut, ChevronRight, Feather, Sparkles, Brain, Camera } from "lucide-react";
import { Switch } from "./ui/switch";
import { useState, useEffect, useRef } from "react";
import { AnimatedGradient } from "./AnimatedGradient";
import { useAuth } from "@/hooks/useAuth";
import { useAI } from "@/hooks/useAI";
import { AccountSettings } from "./AccountSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  mood?: string;
}

interface ProfileScreenProps {
  onLogout: () => void;
  totalEntries: number;
  totalDays: number;
  entries?: Entry[];
}

export const ProfileScreen = ({ onLogout, totalEntries, totalDays, entries = [] }: ProfileScreenProps) => {
  const { user } = useAuth();
  const { getInsights, loadingInsights } = useAI();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Journal User";
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "today";
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [insights, setInsights] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("avatar_url, display_name")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setAvatarUrl(data.avatar_url);
            if (data.display_name) setProfileName(data.display_name);
          }
        });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("journal-media").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("journal-media").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl);
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
      toast.success("Avatar updated!");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (entries.length >= 3 && !insights) {
      getInsights(entries.slice(0, 20), "week").then(setInsights);
    }
  }, [entries.length]);

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (showSettings) {
    return <AccountSettings onBack={() => setShowSettings(false)} />;
  }

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
        <header className="px-6 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </header>

        {/* User Card */}
        <motion.div
          className="mx-6 p-6 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary overflow-hidden shrink-0"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-primary-foreground" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <div>
              <h2 className="text-lg font-semibold text-foreground">{profileName || displayName}</h2>
              <p className="text-sm text-muted-foreground">
                {uploading ? "Uploading..." : `Journaling since ${joinDate}`}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-background/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Feather className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Entries</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalEntries}</p>
            </div>
            <div className="p-4 rounded-2xl bg-background/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">🔥 Streak</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalDays} days</p>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        {insights && (
          <motion.div
            className="mt-6 mx-6 p-5 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Weekly Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{insights.summary}</p>
            {insights.insights?.length > 0 && (
              <div className="space-y-2">
                {insights.insights.slice(0, 3).map((insight: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <Sparkles className="h-3 w-3 text-primary mt-1 shrink-0" />
                    <p className="text-xs text-muted-foreground">{insight}</p>
                  </div>
                ))}
              </div>
            )}
            {insights.encouragement && (
              <p className="mt-3 text-sm font-medium text-primary">{insights.encouragement}</p>
            )}
          </motion.div>
        )}

        {loadingInsights && (
          <motion.div
            className="mt-6 mx-6 p-5 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Brain className="h-5 w-5 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Generating insights...</p>
            </div>
          </motion.div>
        )}

        {/* Settings Section */}
        <motion.div
          className="mt-8 px-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Settings</h3>
          
          <div className="space-y-2">
            {/* Notifications */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">Daily reminders</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Switch theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
            </div>

            {/* Account Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Account Settings</p>
                  <p className="text-sm text-muted-foreground">Manage your account</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          className="mt-8 px-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </motion.div>
      </motion.div>
    </AnimatedGradient>
  );
};
