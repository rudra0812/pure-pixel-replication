import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Image, Mic, Check, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EntryEditorProps {
  onBack: () => void;
  onSave: (entry: { title: string; content: string }) => void;
  initialEntry?: { title: string; content: string };
  selectedDate?: Date | null;
}

export const EntryEditor = ({ onBack, onSave, initialEntry, selectedDate }: EntryEditorProps) => {
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [content, setContent] = useState(initialEntry?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateToShow = selectedDate || new Date();
  const formattedDate = dateToShow.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSave = async () => {
    try {
      setError(null);
      
      // Validate that at least content exists
      if (!content.trim()) {
        setError("Please write something for your journal entry.");
        return;
      }

      setIsSaving(true);
      onSave({ title: title.trim(), content: content.trim() });
      
      // Reset after save
      setTimeout(() => {
        setTitle("");
        setContent("");
        setIsSaving(false);
      }, 300);
    } catch (err) {
      setError("Failed to save entry. Please try again.");
      setIsSaving(false);
      console.error('[v0] Entry save error:', err);
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
          aria-label="Go back"
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" aria-hidden="true" />
        </button>

        <span className="text-secondary text-muted-foreground">
          {formattedDate}
        </span>

        <motion.button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          aria-label={isSaving ? "Saving entry" : "Save entry"}
          aria-busy={isSaving}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary touch-target disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent" />
            </motion.div>
          ) : (
            <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          )}
        </motion.button>
      </header>

      {/* Error Alert */}
      {error && (
        <motion.div
          className="mx-4 mt-4 flex items-start gap-3 rounded-lg bg-red-100 p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" aria-hidden="true" />
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}

      {/* Editor Content */}
      <div className="flex-1 px-4 py-4">
        <Input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Entry title"
          className="mb-4 border-0 bg-transparent p-0 text-2xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0"
        />

        <Textarea
          placeholder="What's on your mind today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Entry content"
          aria-required="true"
          className="min-h-[60vh] resize-none border-0 bg-transparent p-0 text-body placeholder:text-muted-foreground/50 focus-visible:ring-0"
          style={{ lineHeight: "1.4" }}
          autoFocus
        />
      </div>

      {/* Toolbar */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.button
            aria-label="Add image"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
          >
            <Image className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </motion.button>
          <motion.button
            aria-label="Add voice recording"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
          >
            <Mic className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
