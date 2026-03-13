import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PageIllustration } from "@/components/page-illustration";
import { HeroSection } from "@/components/hero-section";
import { FeatureGrid } from "@/components/feature-grid";

export default async function Home() {
  const session = await auth();

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
        <HeroSection isAuthenticated={!!session} />

        {/* Features */}
        <section className="border-t bg-muted/30 px-4 py-20">
          <div className="container mx-auto max-w-5xl">
            <h3 className="mb-12 text-center text-2xl font-bold">
              Everything You Need to Plan Meals Effortlessly
            </h3>
            <FeatureGrid />
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
