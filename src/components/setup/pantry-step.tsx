"use client";

import {
  PANTRY_SPICES,
  PANTRY_CONDIMENTS,
  PANTRY_SPECIALTY,
  PANTRY_EVERYDAY,
} from "@/lib/setup-data";
import { SelectionGrid } from "./selection-grid";
import { SelectedTiles } from "./selected-tiles";

interface PantryStepProps {
  spices: Set<string>;
  condiments: Set<string>;
  specialty: Set<string>;
  everyday: Set<string>;
  onToggleSpice: (id: string) => void;
  onToggleCondiment: (id: string) => void;
  onToggleSpecialty: (id: string) => void;
  onToggleEveryday: (id: string) => void;
  customSpices: Array<{ id: string; name: string }>;
  customCondiments: Array<{ id: string; name: string }>;
  customSpecialty: Array<{ id: string; name: string }>;
  customEveryday: Array<{ id: string; name: string }>;
  onAddCustomSpice: (name: string) => void;
  onAddCustomCondiment: (name: string) => void;
  onAddCustomSpecialty: (name: string) => void;
  onAddCustomEveryday: (name: string) => void;
}

export function PantryStep({
  spices,
  condiments,
  specialty,
  everyday,
  onToggleSpice,
  onToggleCondiment,
  onToggleSpecialty,
  onToggleEveryday,
  customSpices,
  customCondiments,
  customSpecialty,
  customEveryday,
  onAddCustomSpice,
  onAddCustomCondiment,
  onAddCustomSpecialty,
  onAddCustomEveryday,
}: PantryStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        What do you always have on hand?
      </p>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Staples</h3>
        <SelectedTiles
          selected={everyday}
          allItems={[...PANTRY_EVERYDAY, ...customEveryday]}
          onRemove={onToggleEveryday}
          label="Your Staples"
        />
        <SelectionGrid
          items={PANTRY_EVERYDAY}
          selected={everyday}
          onToggle={onToggleEveryday}
          columns={4}
          allowCustom
          customItems={customEveryday}
          onAddCustom={onAddCustomEveryday}
          customPlaceholder="Add other staple..."
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Spices</h3>
        <SelectedTiles
          selected={spices}
          allItems={[...PANTRY_SPICES, ...customSpices]}
          onRemove={onToggleSpice}
          label="Your Spices"
        />
        <SelectionGrid
          items={PANTRY_SPICES}
          selected={spices}
          onToggle={onToggleSpice}
          columns={4}
          allowCustom
          customItems={customSpices}
          onAddCustom={onAddCustomSpice}
          customPlaceholder="Add other spice..."
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Condiments & Oils</h3>
        <SelectedTiles
          selected={condiments}
          allItems={[...PANTRY_CONDIMENTS, ...customCondiments]}
          onRemove={onToggleCondiment}
          label="Your Condiments"
        />
        <SelectionGrid
          items={PANTRY_CONDIMENTS}
          selected={condiments}
          onToggle={onToggleCondiment}
          columns={4}
          allowCustom
          customItems={customCondiments}
          onAddCustom={onAddCustomCondiment}
          customPlaceholder="Add other condiment..."
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Specialty</h3>
        <SelectedTiles
          selected={specialty}
          allItems={[...PANTRY_SPECIALTY, ...customSpecialty]}
          onRemove={onToggleSpecialty}
          label="Your Specialty Items"
        />
        <SelectionGrid
          items={PANTRY_SPECIALTY}
          selected={specialty}
          onToggle={onToggleSpecialty}
          columns={4}
          allowCustom
          customItems={customSpecialty}
          onAddCustom={onAddCustomSpecialty}
          customPlaceholder="Add other specialty item..."
        />
      </div>
    </div>
  );
}
