import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, session.user.id))
      .orderBy(recipes.createdAt);

    return NextResponse.json({ recipes: userRecipes });
  } catch (error) {
    console.error("Recipes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, ingredients, steps, imageUrl, pdfUrl, source, notionId } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [newRecipe] = await db
      .insert(recipes)
      .values({
        userId: session.user.id,
        title,
        category: category || null,
        ingredients: ingredients || [],
        steps: steps || [],
        imageUrl: imageUrl || null,
        pdfUrl: pdfUrl || null,
        source: source || "manual",
        notionId: notionId || null,
      })
      .returning();

    return NextResponse.json({ recipe: newRecipe });
  } catch (error) {
    console.error("Recipe create error:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
