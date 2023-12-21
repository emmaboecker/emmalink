import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  pgEnum,
  pgTableCreator,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { env } from "~/env";

export const pgTable = pgTableCreator(
  (name) => `${env.DATABASE_PREFIX}_${name}`,
);

export const roleEnum = pgEnum("role", ["admin", "user"]);

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  username: text("username").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: roleEnum("role").notNull().default("user"),
});

export const session = pgTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
});

export const key = pgTable("keys", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  hashedPassword: text("hashed_password"),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  url: text("url").notNull(),
  hidden: boolean("hidden").notNull().default(false),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
}));
