import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all Notion-imported recipes for this user
    await db
      .delete(recipes)
      .where(
        and(eq(recipes.userId, session.user.id), eq(recipes.source, "notion"))
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear recipes error:", error);
    return NextResponse.json(
      { error: "Failed to clear recipes" },
      { status: 500 }
    );
  }
}
