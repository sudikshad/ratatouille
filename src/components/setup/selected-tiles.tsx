"use client";

import { X } from "lucide-react";

// Color variants for selected tiles - solid colors
const tileColors = [
  { bg: "bg-[#7B4B94]", text: "text-white", hover: "hover:bg-[#6B3B84]" },
  { bg: "bg-[#E07A5F]", text: "text-white", hover: "hover:bg-[#D06A4F]" },
  { bg: "bg-[#81B29A]", text: "text-white", hover: "hover:bg-[#71A28A]" },
  { bg: "bg-[#D4A574]", text: "text-[#3D2C29]", hover: "hover:bg-[#C49564]" },
];

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
        {selectedItems.map((item, idx) => {
          const color = tileColors[idx % tileColors.length];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onRemove(item.id)}
              className={`group flex items-center gap-1.5 rounded-lg border-2 border-transparent px-3 py-1.5 text-sm font-medium transition-all ${color.bg} ${color.text} ${color.hover}`}
            >
              {item.name}
              <X className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
