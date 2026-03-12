"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Recipe {
  id: string;
  title: string;
  category: string;
}

export default function SavedPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imported, setImported] = useState(false);

  const importFromNotion = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/notion/recipes");
      if (!res.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await res.json();
      setRecipes(data.recipes);
      setImported(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <Button onClick={importFromNotion} disabled={loading}>
            {loading ? "importing..." : "import from notion"}
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!imported && recipes.length === 0 && (
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
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {recipe.title.toLowerCase()}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {imported && recipes.length > 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {recipes.length} recipes imported from notion
          </p>
        )}
      </main>
    </div>
  );
}
