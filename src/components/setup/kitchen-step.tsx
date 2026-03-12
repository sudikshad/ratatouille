"use client";

import { APPLIANCES } from "@/lib/setup-data";
import { SelectionGrid } from "./selection-grid";

interface KitchenStepProps {
  selected: Set<string>;
  onToggle: (id: string) => void;
  customItems: Array<{ id: string; name: string }>;
  onAddCustom: (name: string) => void;
}

export function KitchenStep({
  selected,
  onToggle,
  customItems,
  onAddCustom,
}: KitchenStepProps) {
  return (
    <div>
      <p className="mb-4 text-muted-foreground">
        select the appliances and tools you have
      </p>
      <SelectionGrid
        items={APPLIANCES}
        selected={selected}
        onToggle={onToggle}
        columns={4}
        allowCustom
        customItems={customItems}
        onAddCustom={onAddCustom}
        customPlaceholder="add other appliance..."
      />
    </div>
  );
}
