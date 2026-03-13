"use client";

import { m } from "framer-motion";
import { staggerContainer, fadeUpVariants } from "@/lib/motion";
import { Sparkles, BookOpen, ShoppingCart, UtensilsCrossed } from "lucide-react";

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

export function FeatureGrid() {
  return (
    <m.div
      className="grid gap-8 md:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {features.map((feature) => (
        <m.div
          key={feature.title}
          className="rounded-lg border bg-background p-6 card-hover"
          variants={fadeUpVariants}
        >
          <feature.icon className="mb-4 h-8 w-8 text-primary" />
          <h4 className="mb-2 text-lg font-semibold">{feature.title}</h4>
          <p className="text-muted-foreground">{feature.description}</p>
        </m.div>
      ))}
    </m.div>
  );
}
