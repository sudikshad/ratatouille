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

    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    // Fetch user's pantry
    const user = await db
      .select({ pantry: users.pantry })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const pantry = user[0]?.pantry;
    const pantryItems: string[] = [];
    if (pantry) {
      if (pantry.spices) pantryItems.push(...pantry.spices);
      if (pantry.condiments) pantryItems.push(...pantry.condiments);
      if (pantry.specialty) pantryItems.push(...pantry.specialty);
      if (pantry.everyday) pantryItems.push(...pantry.everyday);
    }

    const prompt = `You are a smart grocery list assistant. Given a list of raw ingredients from multiple recipes and a user's pantry staples, create an optimized shopping list.

## Your tasks:
1. **Aggregate duplicates** - Combine identical or very similar ingredients into single line items
2. **Add up quantities** - Sum quantities when the same ingredient appears multiple times (e.g., "1 cup rice" + "2 cups rice" = "3 cups rice")
3. **Normalize units** - Reconcile mismatched units where possible (e.g., combine 500g and 1 lb of the same item, convert to a sensible unit)
4. **Identify pantry items** - Mark items the user likely already has based on their pantry staples
5. **Fix inconsistencies** - Clean up spelling variations, capitalization, and shorthand (e.g., "tbsp" → "tablespoon")

## Raw ingredients from recipes:
${ingredients.map((ing: string) => `- ${ing}`).join("\n")}

## User's pantry staples (they likely have these):
${pantryItems.length > 0 ? pantryItems.map((item) => `- ${item}`).join("\n") : "No pantry items saved"}

## Output format:
Return a JSON object with this exact structure:
{
  "toBuy": [
    { "item": "chicken breast", "quantity": "2 lbs" },
    { "item": "rice", "quantity": "3 cups" }
  ],
  "fromPantry": [
    { "item": "olive oil", "quantity": "2 tablespoons" },
    { "item": "garlic", "quantity": "4 cloves" }
  ]
}

Rules:
- Keep item names simple and lowercase
- Put the quantity as a separate field
- If no quantity was specified, use "as needed" or estimate based on typical usage
- Be generous with pantry matching - if someone has "olive oil" in their pantry, match "extra virgin olive oil" or "oil for frying"
- Only include items that are actual groceries (skip water, ice, etc.)
- Return ONLY the JSON object, no other text`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse shopping list response");
    }

    const shoppingList = JSON.parse(jsonMatch[0]);

    return NextResponse.json(shoppingList);
  } catch (error) {
    console.error("Shopping list generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}
