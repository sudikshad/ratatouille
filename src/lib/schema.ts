import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  profileCompleted: boolean("profile_completed").default(false).notNull(),
  kitchen: jsonb("kitchen").$type<string[]>(),
  pantry: jsonb("pantry").$type<{
    spices: string[];
    condiments: string[];
    specialty: string[];
    everyday: string[];
  }>(),
  taste: jsonb("taste").$type<{
    cuisines: string[];
    dislikes: string[];
    dietaryStyle: string;
    goals: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  category: text("category"),
  ingredients: jsonb("ingredients").$type<string[]>(),
  steps: jsonb("steps").$type<string[]>(),
  imageUrl: text("image_url"),
  pdfUrl: text("pdf_url"),
  source: text("source").$type<"manual" | "notion" | "upload">().default("manual"),
  notionId: text("notion_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mealPlans = pgTable("meal_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  recipeId: uuid("recipe_id").notNull().references(() => recipes.id),
  day: text("day").$type<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday">(),
  meal: text("meal").$type<"breakfast" | "lunch" | "dinner" | "snack">(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
