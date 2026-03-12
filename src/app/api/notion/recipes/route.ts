import { auth } from "@/lib/auth";
import { fetchRecipeList, fetchNotionRecipes } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const full = searchParams.get("full") === "true";

    if (full) {
      // Fetch full recipe details (slower, for import)
      const recipes = await fetchNotionRecipes();
      return NextResponse.json({ recipes });
    } else {
      // Fetch just titles and categories (faster, for listing)
      const recipes = await fetchRecipeList();
      return NextResponse.json({ recipes });
    }
  } catch (error) {
    console.error("Notion fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes from Notion" },
      { status: 500 }
    );
  }
}
