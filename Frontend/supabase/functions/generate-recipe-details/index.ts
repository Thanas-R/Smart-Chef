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
    const { recipeName, ingredients } = await req.json();
    
    if (!recipeName || !ingredients) {
      return new Response(
        JSON.stringify({ error: "Recipe name and ingredients are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const ingredientsList = Array.isArray(ingredients) ? ingredients.join(", ") : ingredients;

    const prompt = `Generate detailed recipe information for "${recipeName}" using these ingredients: ${ingredientsList}.

Return a JSON object with:
- description (2-3 sentences about the dish)
- cuisine (the type of cuisine, e.g., Italian, Indian, American)
- prep_time_minutes (realistic prep time as a number)
- cook_time_minutes (realistic cook time as a number)
- servings (number of servings as a number)
- difficulty (one of: Easy, Medium, Hard)
- instructions (array of detailed step-by-step cooking instructions, 5-8 steps)
- equipment (array of kitchen equipment needed, like "Pan", "Knife", "Bowl")
- chef_tips (array of 2-3 helpful cooking tips)

Important:
- Use US customary measurements (cups, tbsp, tsp, oz, lb)
- Instructions must be detailed and suitable for both beginners and experienced cooks
- Times should be realistic
- Return ONLY valid JSON, no markdown or extra text`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a professional chef assistant. Generate accurate, detailed recipe information in JSON format only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Clean and parse the JSON response
    // Remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.slice(7);
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith("```")) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();
    
    // Remove control characters that break JSON parsing (except allowed whitespace)
    cleanContent = cleanContent.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    const recipeDetails = JSON.parse(cleanContent);

    return new Response(
      JSON.stringify(recipeDetails),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating recipe details:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate recipe details" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
