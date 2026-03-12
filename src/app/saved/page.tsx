"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AddRecipeModal } from "@/components/add-recipe-modal";
import { Plus, Trash2 } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Load recipes on mount
  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const res = await fetch("/api/recipes");
      if (res.ok) {
        const data = await res.json();
        setRecipes(data.recipes);
      }
    } catch (err) {
      console.error("Failed to load recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const importFromNotion = async () => {
    setImporting(true);
    setError("");

    try {
      // Fetch full recipe details from Notion
      const res = await fetch("/api/notion/recipes?full=true");
      if (!res.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await res.json();

      // Save each recipe to database
      for (const recipe of data.recipes) {
        await fetch("/api/recipes", {
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
      }

      // Reload all recipes
      await loadRecipes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setImporting(false);
    }
  };

  const deleteRecipe = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();

    if (!confirm("Delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRecipes(recipes.filter((r) => r.id !== recipeId));
        localStorage.removeItem(`recipe-${recipeId}`);
      }
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  const addRecipe = async (recipe: {
    title: string;
    category: string;
    ingredients: string[];
    steps: string[];
  }) => {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...recipe,
        source: "manual",
      }),
    });

    if (res.ok) {
      const { recipe: newRecipe } = await res.json();
      setRecipes([...recipes, newRecipe]);
    } else {
      throw new Error("Failed to save recipe");
    }
  };

  const openRecipe = (recipe: Recipe) => {
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
            <h1 className="text-3xl font-bold">recipe library</h1>
            <p className="mt-2 text-muted-foreground">
              {recipes.length} recipes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={importFromNotion} disabled={importing}>
              {importing ? "importing..." : "import from notion"}
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              add recipe
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="py-12 text-center text-muted-foreground">
            loading recipes...
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              no recipes yet. add one or import from notion.
            </p>
          </div>
        )}

        {Object.entries(recipesByCategory).map(([category, categoryRecipes]) => (
          <div key={category} className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
              {category.toLowerCase()}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="group cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => openRecipe(recipe)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-medium">
                        {recipe.title.toLowerCase()}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => deleteRecipe(e, recipe.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                      </Button>
                    </div>
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

        {showAddModal && (
          <AddRecipeModal
            onClose={() => setShowAddModal(false)}
            onSave={addRecipe}
          />
        )}
      </main>
    </div>
  );
}
