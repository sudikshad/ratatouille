"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { staggerContainer, fadeUpVariants } from "@/lib/motion";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-20">
      <m.div
        className="max-w-3xl text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <m.h2
          className="text-4xl font-bold tracking-tight sm:text-6xl"
          variants={fadeUpVariants}
        >
          Plan Meals, Discover Recipes, Shop Smarter
        </m.h2>
        <m.p
          className="mt-6 text-lg text-muted-foreground"
          variants={fadeUpVariants}
        >
          Your all-in-one system for recipe inspiration, meal planning, and
          smarter grocery shopping
        </m.p>
        <m.div
          className="mt-10 flex items-center justify-center gap-4"
          variants={fadeUpVariants}
        >
          {isAuthenticated ? (
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
        </m.div>
      </m.div>
    </section>
  );
}
