"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageIllustration } from "@/components/page-illustration";
import { cn } from "@/lib/utils";
import { AddRecipeModal } from "@/components/add-recipe-modal";
import { Plus, Trash2, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

const CATEGORIES = ["breakfast", "lunch", "dinner", "snacks", "sides"] as const;

interface Recipe {
  id: string;
  title: string;
  category: string;
  ingredients?: string[];
  steps?: string[];
}

export default function SavedPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      const res = await fetch("/api/notion/recipes?full=true");
      if (!res.ok) throw new Error("Failed to fetch recipes");
      const data = await res.json();

      for (const recipe of data.recipes) {
        // Map Notion categories to our categories
        const category = mapCategory(recipe.category);

        await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: recipe.title,
            category,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            source: "notion",
            notionId: recipe.id,
          }),
        });
      }

      await loadRecipes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setImporting(false);
    }
  };

  // Map Notion categories to our fixed categories
  const mapCategory = (notionCategory: string): string => {
    const lower = notionCategory.toLowerCase();
    if (lower.includes("breakfast") || lower.includes("brunch")) return "breakfast";
    if (lower.includes("lunch")) return "lunch";
    if (lower.includes("dinner")) return "dinner";
    if (lower.includes("snack")) return "snacks";
    if (lower.includes("side") || lower.includes("protein")) return "sides";
    return "dinner"; // default
  };

  const deleteRecipe = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    if (!confirm("Delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
      if (res.ok) {
        setRecipes(recipes.filter((r) => r.id !== recipeId));
        localStorage.removeItem(`recipe-${recipeId}`);
      }
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  const addToPlan = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    const success = await addToCart(recipeId);
    if (success) {
      setAddedId(recipeId);
      setTimeout(() => setAddedId(null), 1500);
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
      body: JSON.stringify({ ...recipe, source: "manual" }),
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

  // Filter recipes by search query
  const filteredRecipes = recipes.filter((recipe) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(query) ||
      recipe.ingredients?.some((i) => i.toLowerCase().includes(query))
    );
  });

  // Normalize category for grouping
  const normalizeCategory = (cat: string | undefined): string => {
    if (!cat) return "dinner";
    const lower = cat.toLowerCase();
    if (lower.includes("breakfast") || lower.includes("brunch")) return "breakfast";
    if (lower.includes("lunch")) return "lunch";
    if (lower.includes("dinner")) return "dinner";
    if (lower.includes("snack")) return "snacks";
    if (lower.includes("side") || lower.includes("protein")) return "sides";
    return "dinner";
  };

  // Group by our fixed categories
  const recipesByCategory = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = filteredRecipes.filter(
        (r) => normalizeCategory(r.category) === category
      );
      return acc;
    },
    {} as Record<string, Recipe[]>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <NavBar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-start justify-between">
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

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="search recipes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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

        {!loading && recipes.length > 0 && filteredRecipes.length === 0 && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              no recipes match &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        {CATEGORIES.map((category) => {
          const categoryRecipes = recipesByCategory[category];
          if (categoryRecipes.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h2 className="mb-4 text-lg font-semibold">{category}</h2>
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
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 w-8 p-0 transition-colors",
                              addedId === recipe.id && "text-primary"
                            )}
                            onClick={(e) => addToPlan(e, recipe.id)}
                            title="Add to meal plan"
                          >
                            <ShoppingCart className={cn(
                              "h-4 w-4",
                              addedId === recipe.id ? "text-primary" : "text-muted-foreground hover:text-primary"
                            )} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => deleteRecipe(e, recipe.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                          </Button>
                        </div>
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
          );
        })}

        {showAddModal && (
          <AddRecipeModal
            onClose={() => setShowAddModal(false)}
            onSave={addRecipe}
            categories={CATEGORIES}
          />
        )}
      </main>

      <PageIllustration variant="cookbook" />
    </div>
  );
}
