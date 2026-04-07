import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Image, Mic, Check, Square, Edit3, Volume2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface EntryEditorProps {
  onBack: () => void;
  onSave: (entry: { title: string; content: string; mediaUrl?: string }) => void;
  initialEntry?: { title?: string; content: string };
  selectedDate?: Date | null;
}

// Web Speech API types
interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

export const EntryEditor = ({ onBack, onSave, initialEntry, selectedDate }: EntryEditorProps) => {
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [content, setContent] = useState(initialEntry?.content || "");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const dateToShow = selectedDate || new Date();
  const formattedDate = dateToShow.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setTranscribedText((prev) => prev + " " + finalTranscript.trim());
          }
          setIsTranscribing(interimTranscript.length > 0);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          if (event.error !== "aborted") {
            setIsRecording(false);
            setIsTranscribing(false);
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          setIsTranscribing(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsRecording(true);
      setRecordingDuration(0);
      setTranscribedText("");
      setIsEditMode(false);
      
      recognitionRef.current.start();
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsRecording(false);
    setIsTranscribing(false);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    if (transcribedText.trim()) {
      setContent((prev) => {
        const separator = prev.trim() ? " " : "";
        return prev + separator + transcribedText.trim();
      });
      setTranscribedText("");
    }
  }, [transcribedText]);

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Format recording duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

        <div className="flex items-center gap-2">
          {/* Edit Mode Toggle - Only show when editing existing entry */}
          {initialEntry && (
            <motion.button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex h-11 w-11 items-center justify-center rounded-full touch-target transition-colors ${
                isEditMode ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="h-5 w-5" />
            </motion.button>
          )}

          <motion.button
            onClick={handleSave}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Check className="h-5 w-5 text-primary-foreground" />
          </motion.button>
        </div>
      </header>

      {/* Recording Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className="absolute inset-x-0 top-20 z-50 mx-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-4 shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Audio Wave Animation */}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full bg-white"
                      animate={{
                        height: [8, 24, 8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                
                <div>
                  <p className="text-sm font-medium text-white">Recording...</p>
                  <p className="text-xs text-white/80">{formatDuration(recordingDuration)}</p>
                </div>
              </div>

              <motion.button
                onClick={stopRecording}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Square className="h-4 w-4 text-white fill-white" />
              </motion.button>
            </div>

            {/* Live Transcription Preview */}
            {(transcribedText || isTranscribing) && (
              <motion.div
                className="mt-3 rounded-xl bg-white/10 p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-white/90">
                  {transcribedText}
                  {isTranscribing && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ▊
                    </motion.span>
                  )}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
          placeholder={isRecording ? "Recording... speak now!" : "What's on your mind today?"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`min-h-[60vh] resize-none border-0 bg-transparent p-0 text-body placeholder:text-muted-foreground/50 focus-visible:ring-0 ${
            isRecording ? "opacity-50" : ""
          }`}
          style={{ lineHeight: "1.4" }}
          autoFocus
          readOnly={isRecording}
        />

        {/* Voice Input Hint - Positioned above toolbar */}
        {!content && !isRecording && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground/60">
              Tap the microphone to start voice journaling
            </p>
          </motion.div>
        )}
      </div>

      {/* Toolbar */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Image Button */}
            <motion.button
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted touch-target"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            {/* Mic Button */}
            <motion.button
              onClick={toggleRecording}
              disabled={isRecording}
              className={`flex h-11 w-11 items-center justify-center rounded-full touch-target transition-colors ${
                isRecording
                  ? "bg-rose-500 text-white"
                  : "hover:bg-muted"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div
                    key="recording"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <motion.div
                      className="h-5 w-5 rounded-sm bg-white"
                      animate={{ scale: [1, 0.8, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mic"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Mic className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Voice Mode Indicator */}
            {!isEditMode && content.length > 0 && (
              <motion.div
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Volume2 className="h-3 w-3" />
                Voice Mode
              </motion.div>
            )}
          </div>

          {/* Edit Mode Indicator */}
          {isEditMode && (
            <motion.div
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Edit3 className="h-3 w-3" />
              Edit Mode
            </motion.div>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            {isEditMode
              ? "Edit mode: You can freely edit the text"
              : isRecording
              ? "Recording... Click stop when done"
              : "Voice mode: Record or type your thoughts"}
          </p>
          {content.length > 0 && (
            <p>{content.length} characters</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
