"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface AddRecipeModalProps {
  onClose: () => void;
  onSave: (recipe: {
    title: string;
    category: string;
    ingredients: string[];
    steps: string[];
  }) => Promise<void>;
  categories: readonly string[];
}

export function AddRecipeModal({ onClose, onSave, categories }: AddRecipeModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] || "dinner");
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      const ingredients = ingredientsText
        .split("\n")
        .map((i) => i.trim())
        .filter((i) => i);
      const steps = stepsText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s);

      await onSave({
        title: title.trim(),
        category,
        ingredients,
        steps,
      });
      onClose();
    } catch (err) {
      console.error("Failed to save recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-background p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">add new recipe</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="recipe name"
            />
          </div>

          <div>
            <Label htmlFor="category">category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="ingredients">ingredients (one per line)</Label>
            <textarea
              id="ingredients"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="1 cup rice&#10;2 eggs&#10;1 tbsp soy sauce"
              className="h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <Label htmlFor="steps">steps (one per line)</Label>
            <textarea
              id="steps"
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder="Cook the rice&#10;Fry the eggs&#10;Mix together and add soy sauce"
              className="h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || saving}>
              {saving ? "saving..." : "save recipe"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
