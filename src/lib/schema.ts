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
