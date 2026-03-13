"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageIllustration } from "@/components/page-illustration";
import { ShoppingCart, X, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

interface MealPlanItem {
  id: string;
  recipeId: string;
  day: string | null;
  meal: string | null;
  recipeTitle: string;
  recipeCategory: string;
  recipeIngredients: string[] | null;
}

interface ShoppingListItem {
  id: string;
  item: string;
  quantity: string;
  checked: boolean;
}

export default function GroceriesPage() {
  const { refreshCart } = useCart();
  const [items, setItems] = useState<MealPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [pantryList, setPantryList] = useState<ShoppingListItem[]>([]);
  const [showList, setShowList] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadMealPlan();
    loadSavedShoppingList();
  }, []);

  const loadSavedShoppingList = () => {
    try {
      const savedToBuy = localStorage.getItem("shoppingList-toBuy");
      const savedPantry = localStorage.getItem("shoppingList-pantry");

      if (savedToBuy) {
        setShoppingList(JSON.parse(savedToBuy));
        setShowList(true);
      }
      if (savedPantry) {
        setPantryList(JSON.parse(savedPantry));
      }
    } catch (err) {
      console.error("Failed to load saved shopping list:", err);
    }
  };

  const saveShoppingListToStorage = (toBuy: ShoppingListItem[], pantry: ShoppingListItem[]) => {
    try {
      localStorage.setItem("shoppingList-toBuy", JSON.stringify(toBuy));
      localStorage.setItem("shoppingList-pantry", JSON.stringify(pantry));
    } catch (err) {
      console.error("Failed to save shopping list:", err);
    }
  };

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
        refreshCart();
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
        setShoppingList([]);
        setPantryList([]);
        localStorage.removeItem("shoppingList-toBuy");
        localStorage.removeItem("shoppingList-pantry");
        refreshCart();
      }
    } catch (err) {
      console.error("Failed to clear meal plan:", err);
    }
  };

  // Generate shopping list using Claude
  const generateShoppingList = async () => {
    setGenerating(true);

    try {
      // Collect all ingredients from meal plan
      const allIngredients: string[] = [];
      items.forEach((item) => {
        if (item.recipeIngredients) {
          allIngredients.push(...item.recipeIngredients);
        }
      });

      if (allIngredients.length === 0) {
        setShoppingList([]);
        setPantryList([]);
        setShowList(true);
        return;
      }

      const res = await fetch("/api/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: allIngredients }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate shopping list");
      }

      const data = await res.json();

      // Convert API response to our format
      const toBuy: ShoppingListItem[] = (data.toBuy || []).map(
        (item: { item: string; quantity: string }) => ({
          id: crypto.randomUUID(),
          item: item.item,
          quantity: item.quantity,
          checked: false,
        })
      );

      const fromPantry: ShoppingListItem[] = (data.fromPantry || []).map(
        (item: { item: string; quantity: string }) => ({
          id: crypto.randomUUID(),
          item: item.item,
          quantity: item.quantity,
          checked: false,
        })
      );

      setShoppingList(toBuy);
      setPantryList(fromPantry);
      setShowList(true);
      saveShoppingListToStorage(toBuy, fromPantry);
    } catch (err) {
      console.error("Failed to generate shopping list:", err);
      alert("Failed to generate shopping list. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const updateItem = (id: string, field: "item" | "quantity", value: string) => {
    const updated = shoppingList.map((listItem) =>
      listItem.id === id ? { ...listItem, [field]: value } : listItem
    );
    setShoppingList(updated);
    saveShoppingListToStorage(updated, pantryList);
  };

  const toggleItemChecked = (id: string) => {
    const updated = shoppingList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updated);
    saveShoppingListToStorage(updated, pantryList);
  };

  const removeShoppingItem = (id: string) => {
    const updated = shoppingList.filter((item) => item.id !== id);
    setShoppingList(updated);
    saveShoppingListToStorage(updated, pantryList);
  };

  const togglePantryItemChecked = (id: string) => {
    const updated = pantryList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setPantryList(updated);
    saveShoppingListToStorage(shoppingList, updated);
  };

  const hideList = () => {
    setShowList(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <NavBar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meal Plan</h1>
            <p className="mt-2 text-muted-foreground">
              {items.length} recipe{items.length !== 1 ? "s" : ""} in your plan
            </p>
          </div>
          <div className="flex gap-2">
            {items.length > 0 && (
              <>
                {showList ? (
                  <>
                    <Button variant="outline" onClick={generateShoppingList} disabled={generating}>
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={hideList}>
                      Hide List
                    </Button>
                  </>
                ) : (
                  <Button onClick={generateShoppingList} disabled={generating}>
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {shoppingList.length > 0 ? "Show Shopping List" : "Generate Shopping List"}
                      </>
                    )}
                  </Button>
                )}
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center text-muted-foreground">
            Loading meal plan...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              No recipes in your meal plan yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Go to your recipe library and click the cart icon to add recipes.
            </p>
          </div>
        )}

        {/* Shopping List */}
        {showList && shoppingList.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">To Buy</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {shoppingList.filter((i) => i.checked).length} / {shoppingList.length} items
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {shoppingList.map((listItem) => (
                  <li
                    key={listItem.id}
                    className="group flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={listItem.checked}
                      onChange={() => toggleItemChecked(listItem.id)}
                      className="h-4 w-4 flex-shrink-0 rounded border-gray-300"
                    />
                    <Input
                      type="text"
                      value={listItem.quantity}
                      onChange={(e) => updateItem(listItem.id, "quantity", e.target.value)}
                      className={`w-24 flex-shrink-0 border-none bg-transparent p-0 text-muted-foreground shadow-none focus-visible:ring-0 ${
                        listItem.checked ? "line-through" : ""
                      }`}
                      placeholder="qty"
                    />
                    <Input
                      type="text"
                      value={listItem.item}
                      onChange={(e) => updateItem(listItem.id, "item", e.target.value)}
                      className={`flex-1 border-none bg-transparent p-0 shadow-none focus-visible:ring-0 ${
                        listItem.checked ? "text-muted-foreground line-through" : ""
                      }`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 flex-shrink-0 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removeShoppingItem(listItem.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Pantry Items */}
        {showList && pantryList.length > 0 && (
          <Card className="mb-8 border-dashed">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-muted-foreground">From Your Pantry</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {pantryList.length} items you already have
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pantryList.map((listItem) => (
                  <li
                    key={listItem.id}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={listItem.checked}
                      onChange={() => togglePantryItemChecked(listItem.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className={`w-24 flex-shrink-0 text-muted-foreground ${listItem.checked ? "line-through" : ""}`}>
                      {listItem.quantity}
                    </span>
                    <span
                      className={`flex-1 text-muted-foreground ${
                        listItem.checked ? "line-through" : ""
                      }`}
                    >
                      {listItem.item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {showList && shoppingList.length === 0 && pantryList.length === 0 && (
          <Card className="mb-8">
            <CardContent className="py-8 text-center text-muted-foreground">
              No ingredients found in selected recipes
            </CardContent>
          </Card>
        )}

        {/* Meal Plan Items */}
        {!loading && items.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Recipes</h2>
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

      <PageIllustration variant="shopping" />
    </div>
  );
}
