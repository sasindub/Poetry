import { pgTable, serial, text, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { competitionsTable } from "./competitions";

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "under_review",
  "jury_assigned",
  "evaluated",
  "approved",
  "rejected",
  "archived",
]);

export const poemTypeEnum = pgEnum("poem_type", ["nabati", "classical", "modern"]);

export const submissionsTable = pgTable("submissions", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  poetName: text("poet_name").notNull(),
  poetNameAr: text("poet_name_ar"),
  poetEmail: text("poet_email").notNull(),
  poetPhone: text("poet_phone"),
  poetNationality: text("poet_nationality"),
  poemTitle: text("poem_title").notNull(),
  poemTitleAr: text("poem_title_ar"),
  poemContent: text("poem_content").notNull(),
  poemType: poemTypeEnum("poem_type").notNull(),
  status: submissionStatusEnum("status").notNull().default("pending"),
  reviewerNotes: text("reviewer_notes"),
  finalDecision: text("final_decision"),
  finalScore: real("final_score"),
  competitionId: integer("competition_id").references(() => competitionsTable.id),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({ id: true, submittedAt: true, updatedAt: true });
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;
