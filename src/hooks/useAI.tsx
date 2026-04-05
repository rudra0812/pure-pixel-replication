import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface MoodResult {
  mood: "happy" | "calm" | "sad" | "excited" | "grateful" | "neutral";
  confidence: number;
  summary: string;
}

interface Prompt {
  text: string;
  category: string;
}

interface InsightsResult {
  summary: string;
  dominantMood: string;
  moodBreakdown: Record<string, number>;
  insights: string[];
  encouragement: string;
}

export const useAI = () => {
  const { toast } = useToast();
  const [analyzingMood, setAnalyzingMood] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const analyzeMood = async (content: string, title?: string): Promise<MoodResult | null> => {
    setAnalyzingMood(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-mood", {
        body: { content, title },
      });
      if (error) throw error;
      return data as MoodResult;
    } catch (e: any) {
      console.error("AI mood analysis error:", e);
      toast({ title: "AI Analysis", description: "Could not analyze mood, using keyword detection.", variant: "destructive" });
      return null;
    } finally {
      setAnalyzingMood(false);
    }
  };

  const getPrompts = async (recentEntries: any[]): Promise<Prompt[]> => {
    setLoadingPrompts(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-prompts", {
        body: { recentEntries },
      });
      if (error) throw error;
      return data?.prompts || [];
    } catch (e: any) {
      console.error("AI prompts error:", e);
      return [
        { text: "What made you smile today?", category: "gratitude" },
        { text: "Describe a challenge you overcame recently.", category: "growth" },
        { text: "What are you looking forward to?", category: "reflection" },
      ];
    } finally {
      setLoadingPrompts(false);
    }
  };

  const getInsights = async (entries: any[], period: string): Promise<InsightsResult | null> => {
    setLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke("journal-insights", {
        body: { entries, period },
      });
      if (error) throw error;
      return data as InsightsResult;
    } catch (e: any) {
      console.error("AI insights error:", e);
      toast({ title: "Insights Error", description: "Could not generate insights.", variant: "destructive" });
      return null;
    } finally {
      setLoadingInsights(false);
    }
  };

  return { analyzeMood, analyzingMood, getPrompts, loadingPrompts, getInsights, loadingInsights };
};
