import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { recentEntries } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const entrySummary = (recentEntries || [])
      .slice(0, 5)
      .map((e: any) => `${e.title || "Untitled"}: ${e.content?.substring(0, 100)}`)
      .join("\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a thoughtful journaling prompt generator. Based on the user's recent journal entries, generate 3 personalized writing prompts that encourage reflection and growth. Return ONLY a JSON object with:
- "prompts": array of 3 objects, each with "text" (the prompt) and "category" (one of "reflection", "gratitude", "growth", "creativity", "mindfulness")

Return ONLY valid JSON, no markdown.`,
          },
          {
            role: "user",
            content: entrySummary
              ? `Here are my recent journal entries:\n${entrySummary}`
              : "I haven't written any entries yet. Give me starter prompts for a new journaler.",
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    let result;
    try {
      result = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
    } catch {
      result = {
        prompts: [
          { text: "What made you smile today?", category: "gratitude" },
          { text: "Describe a challenge you overcame recently.", category: "growth" },
          { text: "What are you looking forward to this week?", category: "reflection" },
        ],
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-prompts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
