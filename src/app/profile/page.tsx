"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavBar } from "@/components/nav-bar";
import { PageIllustration } from "@/components/page-illustration";
import { KitchenStep } from "@/components/setup/kitchen-step";
import { PantryStep } from "@/components/setup/pantry-step";
import { TasteStep } from "@/components/setup/taste-step";
import { SelectedTiles } from "@/components/setup/selected-tiles";
import {
  APPLIANCES,
  PANTRY_SPICES,
  PANTRY_CONDIMENTS,
  PANTRY_SPECIALTY,
  PANTRY_EVERYDAY,
  CUISINES,
  DISLIKES,
  DIETARY_STYLES,
  GOALS,
} from "@/lib/setup-data";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  // Fetch existing profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;

        const data = await res.json();

        // Helper to separate known IDs from custom ones
        const separateCustom = (
          ids: string[] | undefined,
          knownItems: Array<{ id: string; name: string }>
        ) => {
          if (!ids) return { known: new Set<string>(), custom: [] as Array<{ id: string; name: string }> };
          const knownIds = new Set(knownItems.map((i) => i.id));
          const known = new Set<string>();
          const custom: Array<{ id: string; name: string }> = [];
          for (const id of ids) {
            if (knownIds.has(id)) {
              known.add(id);
            } else {
              custom.push({ id, name: id.replace(/^custom-/, "").replace(/-/g, " ") });
            }
          }
          return { known, custom };
        };

        // Kitchen
        if (data.kitchen) {
          const { known, custom } = separateCustom(data.kitchen, APPLIANCES);
          setKitchen(known);
          setCustomKitchen(custom);
          if (custom.length > 0) setKitchen(new Set([...known, ...custom.map(c => c.id)]));
        }

        // Pantry
        if (data.pantry) {
          const spicesData = separateCustom(data.pantry.spices, PANTRY_SPICES);
          setSpices(new Set([...spicesData.known, ...spicesData.custom.map(c => c.id)]));
          setCustomSpices(spicesData.custom);

          const condimentsData = separateCustom(data.pantry.condiments, PANTRY_CONDIMENTS);
          setCondiments(new Set([...condimentsData.known, ...condimentsData.custom.map(c => c.id)]));
          setCustomCondiments(condimentsData.custom);

          const specialtyData = separateCustom(data.pantry.specialty, PANTRY_SPECIALTY);
          setSpecialty(new Set([...specialtyData.known, ...specialtyData.custom.map(c => c.id)]));
          setCustomSpecialty(specialtyData.custom);

          const everydayData = separateCustom(data.pantry.everyday, PANTRY_EVERYDAY);
          setEveryday(new Set([...everydayData.known, ...everydayData.custom.map(c => c.id)]));
          setCustomEveryday(everydayData.custom);
        }

        // Taste
        if (data.taste) {
          const cuisinesData = separateCustom(data.taste.cuisines, CUISINES);
          setCuisines(new Set([...cuisinesData.known, ...cuisinesData.custom.map(c => c.id)]));
          setCustomCuisines(cuisinesData.custom);

          const dislikesData = separateCustom(data.taste.dislikes, DISLIKES);
          setDislikes(new Set([...dislikesData.known, ...dislikesData.custom.map(c => c.id)]));
          setCustomDislikes(dislikesData.custom);

          if (data.taste.dietaryStyle) {
            setDietaryStyle(data.taste.dietaryStyle);
          }

          const goalsData = separateCustom(data.taste.goals, GOALS);
          setGoals(new Set([...goalsData.known, ...goalsData.custom.map(c => c.id)]));
          setCustomGoals(goalsData.custom);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setFetching(false);
      }
    }

    fetchProfile();
  }, []);

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
    <div className="relative min-h-screen overflow-hidden bg-background">
      <NavBar />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">your profile</h1>
          <p className="mt-2 text-muted-foreground">
            tell us how you cook
          </p>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">loading your profile...</p>
          </div>
        ) : (
        <Tabs defaultValue="kitchen" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kitchen">kitchen</TabsTrigger>
            <TabsTrigger value="pantry">pantry</TabsTrigger>
            <TabsTrigger value="taste">taste</TabsTrigger>
          </TabsList>

          <TabsContent value="kitchen" className="mt-6">
            <SelectedTiles
              selected={kitchen}
              allItems={[...APPLIANCES, ...customKitchen]}
              onRemove={(id) => toggleSet(kitchen, setKitchen, id)}
              label="your kitchen"
            />
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
            <SelectedTiles
              selected={new Set([
                ...cuisines,
                ...dislikes,
                ...(dietaryStyle ? [dietaryStyle] : []),
                ...goals,
              ])}
              allItems={[
                ...CUISINES, ...customCuisines,
                ...DISLIKES, ...customDislikes,
                ...DIETARY_STYLES,
                ...GOALS, ...customGoals,
              ]}
              onRemove={(id) => {
                if (cuisines.has(id)) toggleSet(cuisines, setCuisines, id);
                else if (dislikes.has(id)) toggleSet(dislikes, setDislikes, id);
                else if (id === dietaryStyle) setDietaryStyle("");
                else if (goals.has(id)) toggleSet(goals, setGoals, id);
              }}
              label="your taste"
            />
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
        )}

        {/* Save Section */}
        {!fetching && (
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
        )}
      </main>

      <PageIllustration variant="kitchen" />
    </div>
  );
}
