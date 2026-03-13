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
      title: "AI Recipe Generation",
      description:
        "Describe what you're craving and get personalized recipes based on your taste preferences, dietary style, and kitchen equipment",
    },
    {
      icon: BookOpen,
      title: "Recipe Library",
      description:
        "Save recipes manually, import from Notion, or save AI-generated ones. Search by name or ingredient",
    },
    {
      icon: UtensilsCrossed,
      title: "Meal Planning",
      description:
        "Add recipes to your weekly meal plan with one click. Build your menu for the week effortlessly",
    },
    {
      icon: ShoppingCart,
      title: "Smart Shopping Lists",
      description:
        "Generate shopping lists that combine quantities, normalize units, and exclude items already in your pantry",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-black">Ratatouille</h1>
          <nav>
            {session ? (
              <Link href="/recipes">
                <Button>Go to App</Button>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
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
              Plan Meals, Discover Recipes, Shop Smarter
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Your all-in-one system for recipe inspiration, meal planning, and smarter grocery shopping
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              {session ? (
                <Link href="/recipes">
                  <Button size="lg">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Recipes
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg">Get Started Free</Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Sign In
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
              Everything You Need to Plan Meals Effortlessly
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
              How It Works
            </h3>
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Set Up Your Profile",
                  description:
                    "Tell us about your kitchen equipment, pantry staples, cuisine preferences, and dietary goals",
                },
                {
                  step: "2",
                  title: "Generate or Save Recipes",
                  description:
                    "Describe what you want and get AI-generated recipes, or import your favorites from Notion",
                },
                {
                  step: "3",
                  title: "Build Your Meal Plan",
                  description:
                    "Add recipes to your weekly plan with one click",
                },
                {
                  step: "4",
                  title: "Generate Your Shopping List",
                  description:
                    "Get an optimized list that combines ingredients and skips what you already have",
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
              <h3 className="mb-4 text-2xl font-bold">Ready to Simplify Meal Planning?</h3>
              <p className="mb-8 text-muted-foreground">
                Join Ratatouille and start generating personalized recipes today
              </p>
              <Link href="/signup">
                <Button size="lg">Get Started Free</Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with Next.js and Claude
        </div>
      </footer>

      <PageIllustration variant="vegetables" />
    </div>
  );
}
