import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    // Fetch user's profile for personalization
    const user = await db
      .select({
        kitchen: users.kitchen,
        pantry: users.pantry,
        taste: users.taste,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const profile = user[0];
    const kitchen = profile?.kitchen || [];
    const pantry = profile?.pantry;
    const taste = profile?.taste;

    const pantryItems: string[] = [];
    if (pantry) {
      if (pantry.spices) pantryItems.push(...pantry.spices);
      if (pantry.condiments) pantryItems.push(...pantry.condiments);
      if (pantry.specialty) pantryItems.push(...pantry.specialty);
      if (pantry.everyday) pantryItems.push(...pantry.everyday);
    }

    const systemPrompt = `You are a creative home chef assistant. Generate recipes that are practical, delicious, and tailored to the user's preferences and available equipment.

## User's Profile:
- **Kitchen equipment**: ${kitchen.length > 0 ? kitchen.join(", ") : "standard kitchen"}
- **Pantry staples**: ${pantryItems.length > 0 ? pantryItems.join(", ") : "basic pantry items"}
- **Cuisine preferences**: ${taste?.cuisines?.join(", ") || "open to all cuisines"}
- **Dislikes/allergies**: ${taste?.dislikes?.join(", ") || "none specified"}
- **Dietary style**: ${taste?.dietaryStyle || "omnivore"}
- **Goals**: ${taste?.goals?.join(", ") || "general cooking"}

## Rules:
1. Generate exactly 3 different recipes that match the user's request
2. Respect their dislikes and dietary restrictions - NEVER include ingredients they dislike
3. Prefer using equipment they have
4. Keep recipes practical for home cooking
5. Include specific quantities for all ingredients
6. Write clear, numbered steps

## Output Format:
Return a JSON object with this exact structure:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "category": "breakfast|lunch|dinner|snacks|sides",
      "description": "One sentence describing the dish",
      "ingredients": [
        "1 cup rice",
        "2 chicken breasts",
        "1 tablespoon olive oil"
      ],
      "steps": [
        "Step 1 instructions",
        "Step 2 instructions"
      ],
      "prepTime": "10 mins",
      "cookTime": "20 mins"
    }
  ]
}

Return ONLY the JSON object, no other text.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse recipes response");
    }

    const recipes = JSON.parse(jsonMatch[0]);

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recipes" },
      { status: 500 }
    );
  }
}
