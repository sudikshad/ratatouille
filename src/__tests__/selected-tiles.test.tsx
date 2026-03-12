import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectedTiles } from "@/components/setup/selected-tiles";

describe("SelectedTiles", () => {
  const mockItems = [
    { id: "italian", name: "italian" },
    { id: "mexican", name: "mexican" },
    { id: "thai", name: "thai" },
  ];

  it("renders selected items as tiles", () => {
    const selected = new Set(["italian", "thai"]);
    const onRemove = vi.fn();

    render(
      <SelectedTiles
        selected={selected}
        allItems={mockItems}
        onRemove={onRemove}
      />
    );

    expect(screen.getByText("italian")).toBeInTheDocument();
    expect(screen.getByText("thai")).toBeInTheDocument();
    expect(screen.queryByText("mexican")).not.toBeInTheDocument();
  });

  it("calls onRemove when tile is clicked", () => {
    const selected = new Set(["italian"]);
    const onRemove = vi.fn();

    render(
      <SelectedTiles
        selected={selected}
        allItems={mockItems}
        onRemove={onRemove}
      />
    );

    fireEvent.click(screen.getByText("italian"));
    expect(onRemove).toHaveBeenCalledWith("italian");
  });

  it("renders nothing when no items selected", () => {
    const selected = new Set<string>();
    const onRemove = vi.fn();

    const { container } = render(
      <SelectedTiles
        selected={selected}
        allItems={mockItems}
        onRemove={onRemove}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("displays label when provided", () => {
    const selected = new Set(["italian"]);
    const onRemove = vi.fn();

    render(
      <SelectedTiles
        selected={selected}
        allItems={mockItems}
        onRemove={onRemove}
        label="your cuisines"
      />
    );

    expect(screen.getByText("your cuisines")).toBeInTheDocument();
  });
});
