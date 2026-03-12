"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KitchenStep } from "@/components/setup/kitchen-step";
import { PantryStep } from "@/components/setup/pantry-step";
import { TasteStep } from "@/components/setup/taste-step";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Kitchen state
  const [kitchen, setKitchen] = useState<Set<string>>(new Set());
  const [customKitchen, setCustomKitchen] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Pantry state
  const [spices, setSpices] = useState<Set<string>>(new Set());
  const [condiments, setCondiments] = useState<Set<string>>(new Set());
  const [specialty, setSpecialty] = useState<Set<string>>(new Set());
  const [everyday, setEveryday] = useState<Set<string>>(new Set());
  const [customSpices, setCustomSpices] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [customCondiments, setCustomCondiments] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [customSpecialty, setCustomSpecialty] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [customEveryday, setCustomEveryday] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Taste state
  const [cuisines, setCuisines] = useState<Set<string>>(new Set());
  const [dislikes, setDislikes] = useState<Set<string>>(new Set());
  const [dietaryStyle, setDietaryStyle] = useState("");
  const [goals, setGoals] = useState<Set<string>>(new Set());
  const [customCuisines, setCustomCuisines] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [customDislikes, setCustomDislikes] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [customGoals, setCustomGoals] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const toggleSet = (
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string
  ) => {
    const newSet = new Set(set);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setter(newSet);
  };

  const addCustomItem = (
    name: string,
    customItems: Array<{ id: string; name: string }>,
    setCustomItems: React.Dispatch<
      React.SetStateAction<Array<{ id: string; name: string }>>
    >,
    selected: Set<string>,
    setSelected: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    const id = `custom-${name.toLowerCase().replace(/\s+/g, "-")}`;
    if (!customItems.some((item) => item.id === id)) {
      setCustomItems([...customItems, { id, name: name.toLowerCase() }]);
      setSelected(new Set([...selected, id]));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitchen: Array.from(kitchen),
          pantry: {
            spices: Array.from(spices),
            condiments: Array.from(condiments),
            specialty: Array.from(specialty),
            everyday: Array.from(everyday),
          },
          taste: {
            cuisines: Array.from(cuisines),
            dislikes: Array.from(dislikes),
            dietaryStyle,
            goals: Array.from(goals),
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            ratatouille
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">your profile</h1>
          <p className="mt-2 text-muted-foreground">
            tell us how you cook
          </p>
        </div>

        <Tabs defaultValue="kitchen" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kitchen">kitchen</TabsTrigger>
            <TabsTrigger value="pantry">pantry</TabsTrigger>
            <TabsTrigger value="taste">taste</TabsTrigger>
          </TabsList>

          <TabsContent value="kitchen" className="mt-6">
            <KitchenStep
              selected={kitchen}
              onToggle={(id) => toggleSet(kitchen, setKitchen, id)}
              customItems={customKitchen}
              onAddCustom={(name) =>
                addCustomItem(
                  name,
                  customKitchen,
                  setCustomKitchen,
                  kitchen,
                  setKitchen
                )
              }
            />
          </TabsContent>

          <TabsContent value="pantry" className="mt-6">
            <PantryStep
              spices={spices}
              condiments={condiments}
              specialty={specialty}
              everyday={everyday}
              onToggleSpice={(id) => toggleSet(spices, setSpices, id)}
              onToggleCondiment={(id) =>
                toggleSet(condiments, setCondiments, id)
              }
              onToggleSpecialty={(id) => toggleSet(specialty, setSpecialty, id)}
              onToggleEveryday={(id) => toggleSet(everyday, setEveryday, id)}
              customSpices={customSpices}
              customCondiments={customCondiments}
              customSpecialty={customSpecialty}
              customEveryday={customEveryday}
              onAddCustomSpice={(name) =>
                addCustomItem(
                  name,
                  customSpices,
                  setCustomSpices,
                  spices,
                  setSpices
                )
              }
              onAddCustomCondiment={(name) =>
                addCustomItem(
                  name,
                  customCondiments,
                  setCustomCondiments,
                  condiments,
                  setCondiments
                )
              }
              onAddCustomSpecialty={(name) =>
                addCustomItem(
                  name,
                  customSpecialty,
                  setCustomSpecialty,
                  specialty,
                  setSpecialty
                )
              }
              onAddCustomEveryday={(name) =>
                addCustomItem(
                  name,
                  customEveryday,
                  setCustomEveryday,
                  everyday,
                  setEveryday
                )
              }
            />
          </TabsContent>

          <TabsContent value="taste" className="mt-6">
            <TasteStep
              cuisines={cuisines}
              dislikes={dislikes}
              dietaryStyle={dietaryStyle}
              goals={goals}
              onToggleCuisine={(id) => toggleSet(cuisines, setCuisines, id)}
              onToggleDislike={(id) => toggleSet(dislikes, setDislikes, id)}
              onSetDietaryStyle={setDietaryStyle}
              onToggleGoal={(id) => toggleSet(goals, setGoals, id)}
              customCuisines={customCuisines}
              customDislikes={customDislikes}
              customGoals={customGoals}
              onAddCustomCuisine={(name) =>
                addCustomItem(
                  name,
                  customCuisines,
                  setCustomCuisines,
                  cuisines,
                  setCuisines
                )
              }
              onAddCustomDislike={(name) =>
                addCustomItem(
                  name,
                  customDislikes,
                  setCustomDislikes,
                  dislikes,
                  setDislikes
                )
              }
              onAddCustomGoal={(name) =>
                addCustomItem(
                  name,
                  customGoals,
                  setCustomGoals,
                  goals,
                  setGoals
                )
              }
            />
          </TabsContent>
        </Tabs>

        {/* Save Section */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {saved && (
              <p className="text-sm text-green-600">profile saved!</p>
            )}
          </div>
          <Button onClick={handleSave} disabled={loading} size="lg">
            {loading ? "saving..." : "save profile"}
          </Button>
        </div>
      </main>
    </div>
  );
}
