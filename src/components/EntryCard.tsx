import { motion } from "framer-motion";
import { Calendar, Image as ImageIcon } from "lucide-react";

interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
}

interface EntryCardProps {
  entry: Entry;
  onClick: () => void;
  index: number;
}

export const EntryCard = ({ entry, onClick, index }: EntryCardProps) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  const getTimeString = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const truncateContent = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <motion.button
      onClick={onClick}
      className="entry-card w-full text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-secondary text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(entry.date)}</span>
          <span>·</span>
          <span>{getTimeString(entry.date)}</span>
        </div>
        {entry.hasMedia && (
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      
      {entry.title && (
        <h3 className="mb-1 font-semibold text-foreground line-clamp-1">
          {entry.title}
        </h3>
      )}
      
      <p className="text-body text-muted-foreground line-clamp-3">
        {truncateContent(entry.content)}
      </p>
    </motion.button>
  );
};
