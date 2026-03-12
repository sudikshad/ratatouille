"use client";

import { X } from "lucide-react";

interface SelectedTilesProps {
  selected: Set<string>;
  allItems: Array<{ id: string; name: string }>;
  onRemove: (id: string) => void;
  label?: string;
}

export function SelectedTiles({
  selected,
  allItems,
  onRemove,
  label,
}: SelectedTilesProps) {
  const selectedItems = allItems.filter((item) => selected.has(item.id));

  if (selectedItems.length === 0) return null;

  return (
    <div className="mb-4">
      {label && (
        <p className="mb-2 text-sm text-muted-foreground">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onRemove(item.id)}
            className="group flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            {item.name}
            <X className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}
