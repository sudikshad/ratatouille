"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SelectionGridProps {
  items: Array<{ id: string; name: string }>;
  selected: Set<string>;
  onToggle: (id: string) => void;
  columns?: number;
  singleSelect?: boolean;
  allowCustom?: boolean;
  customItems?: Array<{ id: string; name: string }>;
  onAddCustom?: (name: string) => void;
  customPlaceholder?: string;
}

export function SelectionGrid({
  items,
  selected,
  onToggle,
  columns = 4,
  singleSelect = false,
  allowCustom = false,
  customItems = [],
  onAddCustom,
  customPlaceholder = "Add other...",
}: SelectionGridProps) {
  const [customInput, setCustomInput] = useState("");

  const handleClick = (id: string) => {
    onToggle(id);
  };

  const handleAddCustom = () => {
    if (customInput.trim() && onAddCustom) {
      onAddCustom(customInput.trim());
      setCustomInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const allItems = [...items, ...customItems];

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "grid gap-2",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-2 sm:grid-cols-3",
          columns === 4 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        )}
      >
        {allItems.map((item) => {
          const isSelected = selected.has(item.id);
          const isCustom = customItems.some((c) => c.id === item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary/10 text-primary border-2"
                  : "border-border bg-background text-foreground",
                isCustom && "italic"
              )}
            >
              {item.name}
            </button>
          );
        })}
      </div>
      {allowCustom && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={customPlaceholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
