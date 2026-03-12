"use client";

import { CUISINES, DISLIKES, DIETARY_STYLES, GOALS } from "@/lib/setup-data";
import { SelectionGrid } from "./selection-grid";

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
        what do you enjoy?
      </p>

      <div>
        <h3 className="mb-3 text-lg font-semibold">favorite cuisines</h3>
        <SelectionGrid
          items={CUISINES}
          selected={cuisines}
          onToggle={onToggleCuisine}
          columns={4}
          allowCustom
          customItems={customCuisines}
          onAddCustom={onAddCustomCuisine}
          customPlaceholder="add other cuisine..."
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">ingredients to avoid</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          things you don&apos;t like or can&apos;t eat
        </p>
        <SelectionGrid
          items={DISLIKES}
          selected={dislikes}
          onToggle={onToggleDislike}
          columns={4}
          allowCustom
          customItems={customDislikes}
          onAddCustom={onAddCustomDislike}
          customPlaceholder="add other ingredient..."
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">dietary style</h3>
        <SelectionGrid
          items={DIETARY_STYLES}
          selected={dietaryStyleSet}
          onToggle={onSetDietaryStyle}
          columns={4}
          singleSelect
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">meal goals</h3>
        <SelectionGrid
          items={GOALS}
          selected={goals}
          onToggle={onToggleGoal}
          columns={4}
          allowCustom
          customItems={customGoals}
          onAddCustom={onAddCustomGoal}
          customPlaceholder="add other goal..."
        />
      </div>
    </div>
  );
}
