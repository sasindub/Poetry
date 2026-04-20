import { pgTable, serial, text, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { submissionsTable } from "./submissions";
import { usersTable } from "./users";

export const recommendationEnum = pgEnum("recommendation", ["approve", "reject", "needs_revision"]);

export const evaluationsTable = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").references(() => submissionsTable.id).notNull(),
  juryMemberId: integer("jury_member_id").references(() => usersTable.id).notNull(),
  linguisticScore: real("linguistic_score").notNull(),
  poeticScore: real("poetic_score").notNull(),
  originalityScore: real("originality_score").notNull(),
  emotionalScore: real("emotional_score").notNull(),
  culturalScore: real("cultural_score").notNull(),
  totalScore: real("total_score").notNull(),
  notes: text("notes"),
  recommendation: recommendationEnum("recommendation").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertEvaluationSchema = createInsertSchema(evaluationsTable).omit({ id: true, submittedAt: true });
export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;
export type Evaluation = typeof evaluationsTable.$inferSelect;
