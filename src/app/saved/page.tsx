"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Recipe {
  id: string;
  title: string;
  category: string;
  ingredients?: string[];
  steps?: string[];
  source?: string;
}

export default function SavedPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imported, setImported] = useState(false);

  // Load saved recipes from database on mount
  useEffect(() => {
    async function loadRecipes() {
      try {
        const res = await fetch("/api/recipes");
        if (res.ok) {
          const data = await res.json();
          if (data.recipes.length > 0) {
            setRecipes(data.recipes);
            setImported(true);
          }
        }
      } catch (err) {
        console.error("Failed to load recipes:", err);
      }
    }
    loadRecipes();
  }, []);

  const importFromNotion = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch full recipe details from Notion
      const res = await fetch("/api/notion/recipes?full=true");
      if (!res.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await res.json();

      // Save each recipe to database and localStorage
      const savedRecipes: Recipe[] = [];
      for (const recipe of data.recipes) {
        // Save to database
        const saveRes = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: recipe.title,
            category: recipe.category,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            source: "notion",
            notionId: recipe.id,
          }),
        });

        if (saveRes.ok) {
          const { recipe: savedRecipe } = await saveRes.json();
          savedRecipes.push(savedRecipe);

          // Cache in localStorage for quick access
          localStorage.setItem(
            `recipe-${savedRecipe.id}`,
            JSON.stringify(savedRecipe)
          );
        }
      }

      setRecipes(savedRecipes);
      setImported(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openRecipe = (recipe: Recipe) => {
    // Cache recipe data before navigating
    localStorage.setItem(`recipe-${recipe.id}`, JSON.stringify(recipe));
    router.push(`/saved/${recipe.id}`);
  };

  // Group recipes by category
  const recipesByCategory = recipes.reduce(
    (acc, recipe) => {
      const category = recipe.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(recipe);
      return acc;
    },
    {} as Record<string, Recipe[]>
  );

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">saved recipes</h1>
            <p className="mt-2 text-muted-foreground">
              your collection of favorite recipes
            </p>
          </div>
          {!imported && (
            <Button onClick={importFromNotion} disabled={loading}>
              {loading ? "importing..." : "import from notion"}
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-lg border p-4 text-muted-foreground">
            importing recipes from notion... this may take a moment
          </div>
        )}

        {!imported && recipes.length === 0 && !loading && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              click &quot;import from notion&quot; to load your recipes
            </p>
          </div>
        )}

        {Object.entries(recipesByCategory).map(([category, categoryRecipes]) => (
          <div key={category} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
              {category.toLowerCase()}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => openRecipe(recipe)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {recipe.title.toLowerCase()}
                    </CardTitle>
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {recipe.ingredients.length} ingredients
                      </p>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {imported && recipes.length > 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {recipes.length} recipes
          </p>
        )}
      </main>
    </div>
  );
}
