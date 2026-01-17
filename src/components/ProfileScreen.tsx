import { motion } from "framer-motion";
import { User, Settings, Bell, Moon, LogOut, ChevronRight, Feather } from "lucide-react";
import { Switch } from "./ui/switch";
import { useState } from "react";

interface ProfileScreenProps {
  onLogout: () => void;
  totalEntries: number;
  totalDays: number;
}

export const ProfileScreen = ({ onLogout, totalEntries, totalDays }: ProfileScreenProps) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-background safe-area-top pb-28"
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
        className="mx-6 p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Journal User</h2>
            <p className="text-sm text-muted-foreground">Journaling since today</p>
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
          <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
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
          <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Moon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Switch theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          {/* Account Settings */}
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:bg-muted transition-colors">
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
  );
};
