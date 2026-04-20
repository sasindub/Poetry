import { pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";

export const activityTypeEnum = pgEnum("activity_type", [
  "submission",
  "evaluation",
  "status_change",
  "user_created",
  "jury_assigned",
]);

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: activityTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  actor: text("actor"),
  referenceId: integer("reference_id"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export type Activity = typeof activitiesTable.$inferSelect;
