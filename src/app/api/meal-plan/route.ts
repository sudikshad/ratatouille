import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mealPlans, recipes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all meal plan items with recipe details
    const items = await db
      .select({
        id: mealPlans.id,
        recipeId: mealPlans.recipeId,
        day: mealPlans.day,
        meal: mealPlans.meal,
        recipeTitle: recipes.title,
        recipeCategory: recipes.category,
        recipeIngredients: recipes.ingredients,
      })
      .from(mealPlans)
      .innerJoin(recipes, eq(mealPlans.recipeId, recipes.id))
      .where(eq(mealPlans.userId, session.user.id));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Meal plan fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plan" },
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

    const { recipeId, day, meal } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: "Recipe ID required" }, { status: 400 });
    }

    const [item] = await db
      .insert(mealPlans)
      .values({
        userId: session.user.id,
        recipeId,
        day: day || null,
        meal: meal || null,
      })
      .returning();

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Meal plan add error:", error);
    return NextResponse.json(
      { error: "Failed to add to meal plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      await db
        .delete(mealPlans)
        .where(eq(mealPlans.userId, session.user.id));
    } else if (itemId) {
      await db
        .delete(mealPlans)
        .where(
          and(eq(mealPlans.id, itemId), eq(mealPlans.userId, session.user.id))
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Meal plan delete error:", error);
    return NextResponse.json(
      { error: "Failed to remove from meal plan" },
      { status: 500 }
    );
  }
}
