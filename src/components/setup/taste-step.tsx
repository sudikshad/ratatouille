"use client";

import { CUISINES, DISLIKES, DIETARY_STYLES, GOALS } from "@/lib/setup-data";
import { SelectionGrid } from "./selection-grid";
import { SelectedTiles } from "./selected-tiles";

interface TasteStepProps {
  cuisines: Set<string>;
  dislikes: Set<string>;
  dietaryStyle: string;
  goals: Set<string>;
  onToggleCuisine: (id: string) => void;
  onToggleDislike: (id: string) => void;
  onSetDietaryStyle: (id: string) => void;
  onToggleGoal: (id: string) => void;
  customCuisines: Array<{ id: string; name: string }>;
  customDislikes: Array<{ id: string; name: string }>;
  customGoals: Array<{ id: string; name: string }>;
  onAddCustomCuisine: (name: string) => void;
  onAddCustomDislike: (name: string) => void;
  onAddCustomGoal: (name: string) => void;
}

export function TasteStep({
  cuisines,
  dislikes,
  dietaryStyle,
  goals,
  onToggleCuisine,
  onToggleDislike,
  onSetDietaryStyle,
  onToggleGoal,
  customCuisines,
  customDislikes,
  customGoals,
  onAddCustomCuisine,
  onAddCustomDislike,
  onAddCustomGoal,
}: TasteStepProps) {
  const dietaryStyleSet = new Set(dietaryStyle ? [dietaryStyle] : []);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        What do you enjoy?
      </p>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Favorite Cuisines</h3>
        <SelectedTiles
          selected={cuisines}
          allItems={[...CUISINES, ...customCuisines]}
          onRemove={onToggleCuisine}
          label="Your Cuisines"
        />
        <SelectionGrid
          items={CUISINES}
          selected={cuisines}
          onToggle={onToggleCuisine}
          columns={4}
          allowCustom
          customItems={customCuisines}
          onAddCustom={onAddCustomCuisine}
          customPlaceholder="Add other cuisine..."
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Ingredients to Avoid</h3>
        <SelectedTiles
          selected={dislikes}
          allItems={[...DISLIKES, ...customDislikes]}
          onRemove={onToggleDislike}
          label="Your Dislikes"
        />
        <p className="mb-3 text-sm text-muted-foreground">
          Things you don&apos;t like or can&apos;t eat
        </p>
        <SelectionGrid
          items={DISLIKES}
          selected={dislikes}
          onToggle={onToggleDislike}
          columns={4}
          allowCustom
          customItems={customDislikes}
          onAddCustom={onAddCustomDislike}
          customPlaceholder="Add other ingredient..."
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Dietary Style</h3>
        <SelectedTiles
          selected={dietaryStyleSet}
          allItems={DIETARY_STYLES}
          onRemove={onSetDietaryStyle}
          label="Your Style"
        />
        <SelectionGrid
          items={DIETARY_STYLES}
          selected={dietaryStyleSet}
          onToggle={onSetDietaryStyle}
          columns={4}
          singleSelect
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Meal Goals</h3>
        <SelectedTiles
          selected={goals}
          allItems={[...GOALS, ...customGoals]}
          onRemove={onToggleGoal}
          label="Your Goals"
        />
        <SelectionGrid
          items={GOALS}
          selected={goals}
          onToggle={onToggleGoal}
          columns={4}
          allowCustom
          customItems={customGoals}
          onAddCustom={onAddCustomGoal}
          customPlaceholder="Add other goal..."
        />
      </div>
    </div>
  );
}
