"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageIllustration } from "@/components/page-illustration";
import { Loader2, Sparkles, BookmarkPlus, ShoppingCart, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { staggerContainer, fadeUpVariants } from "@/lib/motion";

interface GeneratedRecipe {
  title: string;
  category: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: string;
  cookTime: string;
}

export default function RecipesPage() {
  const { addToCart } = useCart();
  const [prompt, setPrompt] = useState("");
  const [recipes, setRecipes] = useState<GeneratedRecipe[]>([]);
  const [generating, setGenerating] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const generateRecipes = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    setRecipes([]);
    setSavedIds(new Set());
    setAddedIds(new Set());

    try {
      const res = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate recipes");
      }

      const data = await res.json();
      setRecipes(data.recipes || []);
      if (data.recipes?.length > 0) {
        setExpandedRecipe(0);
      }
    } catch (err) {
      console.error("Failed to generate recipes:", err);
      alert("Failed to generate recipes. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const saveRecipe = async (recipe: GeneratedRecipe, index: number) => {
    setSavingId(index);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipe.title,
          category: recipe.category,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          source: "manual",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save recipe");
      }

      setSavedIds(new Set([...savedIds, index]));
    } catch (err) {
      console.error("Failed to save recipe:", err);
      alert("Failed to save recipe. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const addToMealPlan = async (recipe: GeneratedRecipe, index: number) => {
    setAddingId(index);

    try {
      // First save the recipe to get an ID
      const saveRes = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipe.title,
          category: recipe.category,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          source: "manual",
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save recipe");
      }

      const { recipe: savedRecipe } = await saveRes.json();

      // Then add to meal plan
      const success = await addToCart(savedRecipe.id);
      if (success) {
        setAddedIds(new Set([...addedIds, index]));
        setSavedIds(new Set([...savedIds, index]));
      }
    } catch (err) {
      console.error("Failed to add to meal plan:", err);
      alert("Failed to add to meal plan. Please try again.");
    } finally {
      setAddingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !generating) {
      generateRecipes();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <NavBar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New Recipes</h1>
          <p className="mt-2 text-muted-foreground">
            Describe what you're in the mood for and get personalized suggestions
          </p>
        </div>

        {/* Input */}
        <div className="mb-8 flex gap-3">
          <Input
            type="text"
            placeholder="e.g., high protein dinner with few ingredients, quick vegetarian lunch, comfort food for a rainy day..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={generating}
          />
          <Button onClick={generateRecipes} disabled={generating || !prompt.trim()}>
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>

        {/* Example prompts */}
        {recipes.length === 0 && !generating && (
          <div className="mb-8">
            <p className="mb-3 text-sm text-muted-foreground">Try something like:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "quick weeknight dinner under 30 minutes",
                "high protein meal prep for the week",
                "cozy soup for a cold day",
                "impressive dish for date night",
                "healthy breakfast with eggs",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(example)}
                  className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state with skeleton */}
        {generating && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-full max-w-md" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
            <p className="text-center text-sm text-muted-foreground">
              Creating recipes based on your preferences...
            </p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
        {recipes.length > 0 && (
          <m.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {recipes.map((recipe, index) => (
              <m.div key={index} variants={fadeUpVariants}>
              <Card className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setExpandedRecipe(expandedRecipe === index ? null : index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{recipe.title.toLowerCase()}</CardTitle>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {recipe.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {recipe.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          prep: {recipe.prepTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          cook: {recipe.cookTime}
                        </span>
                        <span>{recipe.ingredients.length} ingredients</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedRecipe === index ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedRecipe === index && (
                  <CardContent className="border-t pt-4">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Ingredients */}
                      <div>
                        <h3 className="mb-3 font-semibold">Ingredients</h3>
                        <ul className="space-y-1">
                          {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                              {ing.toLowerCase()}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Steps */}
                      <div>
                        <h3 className="mb-3 font-semibold">Steps</h3>
                        <ol className="space-y-2">
                          {recipe.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3 border-t pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveRecipe(recipe, index)}
                        disabled={savingId === index || savedIds.has(index)}
                      >
                        {savingId === index ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                        )}
                        {savedIds.has(index) ? "Saved!" : "Save to Library"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addToMealPlan(recipe, index)}
                        disabled={addingId === index || addedIds.has(index)}
                      >
                        {addingId === index ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="mr-2 h-4 w-4" />
                        )}
                        {addedIds.has(index) ? "Added!" : "Add to Meal Plan"}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
              </m.div>
            ))}
          </m.div>
        )}
        </AnimatePresence>
      </main>

      <PageIllustration variant="chef" />
    </div>
  );
}
