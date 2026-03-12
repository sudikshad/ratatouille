"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Calendar } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  category: string;
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  source: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for cached recipe data (from Notion import)
    const cached = localStorage.getItem(`recipe-${params.id}`);
    if (cached) {
      setRecipe(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // Otherwise fetch from database
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setRecipe(data.recipe);
        }
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [params.id]);

  const deleteRecipe = async () => {
    if (!confirm("Delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${params.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        localStorage.removeItem(`recipe-${params.id}`);
        router.push("/saved");
      }
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  const addToPlan = async () => {
    try {
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: params.id }),
      });
      if (res.ok) {
        alert("Added to meal plan!");
      }
    } catch (err) {
      console.error("Failed to add to meal plan:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="container mx-auto max-w-2xl px-4 py-8">
          <p className="text-muted-foreground">loading recipe...</p>
        </main>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="container mx-auto max-w-2xl px-4 py-8">
          <p className="text-muted-foreground">recipe not found</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => router.push("/saved")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            back to recipes
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/saved")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            back to recipes
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addToPlan}
            >
              <Calendar className="mr-2 h-4 w-4" />
              add to meal plan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteRecipe}
              className="text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              delete
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground">{recipe.category?.toLowerCase()}</p>
          <h1 className="mt-1 text-3xl font-bold">{recipe.title.toLowerCase()}</h1>
        </div>

        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="mb-8 w-full rounded-lg object-cover"
          />
        )}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{ingredient.toLowerCase()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.steps && recipe.steps.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">steps</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {(!recipe.ingredients?.length && !recipe.steps?.length) && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              no details available for this recipe yet
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
