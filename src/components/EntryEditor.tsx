import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Image, Mic, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EntryEditorProps {
  onBack: () => void;
  onSave: (entry: { title: string; content: string }) => void;
  initialEntry?: { title: string; content: string };
}

export const EntryEditor = ({ onBack, onSave, initialEntry }: EntryEditorProps) => {
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [content, setContent] = useState(initialEntry?.content || "");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSave = () => {
    if (content.trim() || title.trim()) {
      onSave({ title: title.trim(), content: content.trim() });
    }
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-background safe-area-top safe-area-bottom"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        <span className="text-secondary text-muted-foreground">
          {formattedDate}
        </span>

        <motion.button
          onClick={handleSave}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary touch-target"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Check className="h-5 w-5 text-primary-foreground" />
        </motion.button>
      </header>

      {/* Editor Content */}
      <div className="flex-1 px-4 py-4">
        <Input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 border-0 bg-transparent p-0 text-2xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0"
        />

        <Textarea
          placeholder="What's on your mind today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[60vh] resize-none border-0 bg-transparent p-0 text-body placeholder:text-muted-foreground/50 focus-visible:ring-0"
          style={{ lineHeight: "1.4" }}
          autoFocus
        />
      </div>

      {/* Toolbar */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.button
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image className="h-5 w-5 text-muted-foreground" />
          </motion.button>
          <motion.button
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
