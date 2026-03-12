"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart, X } from "lucide-react";

interface MealPlanItem {
  id: string;
  recipeId: string;
  day: string | null;
  meal: string | null;
  recipeTitle: string;
  recipeCategory: string;
  recipeIngredients: string[] | null;
}

export default function GroceriesPage() {
  const [items, setItems] = useState<MealPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    loadMealPlan();
  }, []);

  const loadMealPlan = async () => {
    try {
      const res = await fetch("/api/meal-plan");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (err) {
      console.error("Failed to load meal plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/meal-plan?id=${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== itemId));
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const clearAll = async () => {
    if (!confirm("Clear all items from your meal plan?")) return;
    try {
      const res = await fetch("/api/meal-plan?clearAll=true", {
        method: "DELETE",
      });
      if (res.ok) {
        setItems([]);
        setShowList(false);
      }
    } catch (err) {
      console.error("Failed to clear meal plan:", err);
    }
  };

  // Aggregate ingredients from all recipes
  const generateShoppingList = (): string[] => {
    const allIngredients: string[] = [];
    items.forEach((item) => {
      if (item.recipeIngredients) {
        allIngredients.push(...item.recipeIngredients);
      }
    });

    // Simple deduplication (case-insensitive)
    const seen = new Set<string>();
    const unique: string[] = [];
    allIngredients.forEach((ing) => {
      const lower = ing.toLowerCase().trim();
      if (!seen.has(lower)) {
        seen.add(lower);
        unique.push(ing);
      }
    });

    return unique.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  };

  const shoppingList = generateShoppingList();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">meal plan</h1>
            <p className="mt-2 text-muted-foreground">
              {items.length} recipe{items.length !== 1 ? "s" : ""} in your plan
            </p>
          </div>
          <div className="flex gap-2">
            {items.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowList(!showList)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {showList ? "hide list" : "shopping list"}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  clear all
                </Button>
              </>
            )}
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center text-muted-foreground">
            loading meal plan...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              no recipes in your meal plan yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              go to your recipe library and click the calendar icon to add recipes.
            </p>
          </div>
        )}

        {/* Shopping List */}
        {showList && shoppingList.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">shopping list</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {shoppingList.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                    />
                    <span>{ingredient.toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Meal Plan Items */}
        {!loading && items.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">recipes</h2>
            {items.map((item) => (
              <Card key={item.id} className="group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-medium">
                        {item.recipeTitle.toLowerCase()}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {item.recipeCategory?.toLowerCase()}
                        {item.recipeIngredients &&
                          ` • ${item.recipeIngredients.length} ingredients`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
