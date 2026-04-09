import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Entry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  hasMedia?: boolean;
  mood?: "happy" | "calm" | "sad" | "excited" | "grateful" | "neutral";
}

type MoodType = Entry["mood"];

export const useEntries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    if (!user) { setEntries([]); setLoading(false); return; }
    
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false });

    if (error) {
      toast({ title: "Error loading entries", description: error.message, variant: "destructive" });
    } else {
      setEntries(
        (data || []).map((e) => ({
          id: e.id,
          date: new Date(e.entry_date + "T12:00:00"),
          title: e.title || undefined,
          content: e.content,
          mood: (e.mood as MoodType) || undefined,
          hasMedia: !!e.media_url,
        }))
      );
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const saveEntry = async (
    entry: { title: string; content: string; mood?: MoodType },
    date: Date,
    entryId?: string
  ) => {
    if (!user) return;

    if (entryId) {
      const { error } = await supabase
        .from("journal_entries")
        .update({
          title: entry.title || null,
          content: entry.content,
          mood: entry.mood || null,
        })
        .eq("id", entryId)
        .eq("user_id", user.id);

      if (error) {
        toast({ title: "Error updating entry", description: error.message, variant: "destructive" });
        return;
      }
    } else {
      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        title: entry.title || null,
        content: entry.content,
        mood: entry.mood || null,
        entry_date: date.toISOString().split("T")[0],
      });

      if (error) {
        toast({ title: "Error saving entry", description: error.message, variant: "destructive" });
        return;
      }
    }

    await fetchEntries();
  };

  const deleteEntry = async (entryId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", entryId)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error deleting entry", description: error.message, variant: "destructive" });
    } else {
      await fetchEntries();
    }
  };

  return { entries, loading, saveEntry, deleteEntry, refetch: fetchEntries };
};
