import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PageIllustration } from "@/components/page-illustration";
import { Sparkles, BookOpen, ShoppingCart, UtensilsCrossed } from "lucide-react";

export default async function Home() {
  const session = await auth();

  const features = [
    {
      icon: Sparkles,
      title: "ai recipe generation",
      description:
        "describe what you're craving and get personalized recipes based on your taste preferences, dietary style, and kitchen equipment",
    },
    {
      icon: BookOpen,
      title: "recipe library",
      description:
        "save recipes manually, import from notion, or save ai-generated ones. search by name or ingredient",
    },
    {
      icon: UtensilsCrossed,
      title: "meal planning",
      description:
        "add recipes to your weekly meal plan with one click. build your menu for the week effortlessly",
    },
    {
      icon: ShoppingCart,
      title: "smart shopping lists",
      description:
        "generate shopping lists that combine quantities, normalize units, and exclude items already in your pantry",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Wooden spoon - realistic */}
              <defs>
                <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4A574" />
                  <stop offset="30%" stopColor="#C4956A" />
                  <stop offset="50%" stopColor="#B8895E" />
                  <stop offset="70%" stopColor="#C4956A" />
                  <stop offset="100%" stopColor="#D4A574" />
                </linearGradient>
                <linearGradient id="bowlGrain" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C4956A" />
                  <stop offset="50%" stopColor="#A67B5B" />
                  <stop offset="100%" stopColor="#8B6914" />
                </linearGradient>
              </defs>
              {/* Handle */}
              <rect x="14" y="14" width="5" height="18" rx="2" fill="url(#woodGrain)" />
              {/* Spoon bowl */}
              <ellipse cx="16.5" cy="8" rx="8" ry="6" fill="url(#bowlGrain)" />
              {/* Bowl inner shadow */}
              <ellipse cx="16.5" cy="8.5" rx="5.5" ry="3.5" fill="#96784C" opacity="0.4" />
            </svg>
            <h1 className="text-xl font-bold text-black">ratatouille</h1>
          </div>
          <nav>
            {session ? (
              <Link href="/recipes">
                <Button>go to app</Button>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost">sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button>get started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              plan meals, discover recipes, shop smarter
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              your all-in-one system for recipe inspiration, meal planning, and smarter grocery shopping
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              {session ? (
                <Link href="/recipes">
                  <Button size="lg">
                    <Sparkles className="mr-2 h-4 w-4" />
                    generate recipes
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg">get started free</Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      sign in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 px-4 py-20">
          <div className="container mx-auto max-w-5xl">
            <h3 className="mb-12 text-center text-2xl font-bold">
              everything you need to plan meals effortlessly
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border bg-background p-6"
                >
                  <feature.icon className="mb-4 h-8 w-8 text-primary" />
                  <h4 className="mb-2 text-lg font-semibold">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-3xl">
            <h3 className="mb-12 text-center text-2xl font-bold">
              how it works
            </h3>
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "set up your profile",
                  description:
                    "tell us about your kitchen equipment, pantry staples, cuisine preferences, and dietary goals",
                },
                {
                  step: "2",
                  title: "generate or save recipes",
                  description:
                    "describe what you want and get ai-generated recipes, or import your favorites from notion",
                },
                {
                  step: "3",
                  title: "build your meal plan",
                  description:
                    "add recipes to your weekly plan with one click",
                },
                {
                  step: "4",
                  title: "generate your shopping list",
                  description:
                    "get an optimized list that combines ingredients and skips what you already have",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        {!session && (
          <section className="border-t bg-muted/30 px-4 py-20">
            <div className="container mx-auto max-w-2xl text-center">
              <h3 className="mb-4 text-2xl font-bold">ready to simplify meal planning?</h3>
              <p className="mb-8 text-muted-foreground">
                join ratatouille and start generating personalized recipes today
              </p>
              <Link href="/signup">
                <Button size="lg">get started free</Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          built with next.js and claude
        </div>
      </footer>

      <PageIllustration variant="vegetables" />
    </div>
  );
}
