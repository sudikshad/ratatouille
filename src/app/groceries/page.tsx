"use client";

import { NavBar } from "@/components/nav-bar";

export default function GroceriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">weekly groceries</h1>
          <p className="mt-2 text-muted-foreground">
            plan your shopping list for the week
          </p>
        </div>

        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">coming soon</p>
        </div>
      </main>
    </div>
  );
}
