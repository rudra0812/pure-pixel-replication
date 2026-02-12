import { motion } from "framer-motion";
import { Home, CalendarDays, User } from "lucide-react";

export type NavTab = "mood" | "calendar" | "profile";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const tabs = [
  { id: "mood" as NavTab, icon: Home, label: "Home" },
  { id: "calendar" as NavTab, icon: CalendarDays, label: "Calendar" },
  { id: "profile" as NavTab, icon: User, label: "Profile" },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      aria-label="Main navigation"
    >
      <div className="mx-4 mb-4 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-lg">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className="relative flex flex-col items-center gap-1 px-6 py-2 rounded-xl touch-target hover:bg-muted/50 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon 
                    className={`h-6 w-6 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  />
                </motion.div>
                
                <motion.span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  animate={{ opacity: isActive ? 1 : 0.7 }}
                >
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};
