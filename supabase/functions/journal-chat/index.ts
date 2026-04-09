import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, entries, history } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const entrySummary = (entries || [])
      .map((e: any) => `[${e.date}] ${e.title}: ${e.content}`)
      .join("\n");

    const conversationMessages = [
      {
        role: "system",
        content: `You are a warm, empathetic journal companion AI. The user keeps a personal journal/diary. Here are their recent entries for context:\n\n${entrySummary || "No entries yet."}\n\nBe supportive, insightful, and concise. Help them reflect on patterns, emotions, and growth. If they ask about a specific entry or date, refer to the entries above. Keep responses under 3 sentences unless they ask for more detail. Use a gentle, encouraging tone.`,
      },
      ...(history || []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: conversationMessages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ reply: "I'm getting too many requests right now. Please wait a moment and try again." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ reply: "AI credits have been exhausted. Please add funds to continue chatting." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't form a response. Try again?";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Journal chat error:", error);
    return new Response(JSON.stringify({ reply: "Something went wrong. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
