import { Router, type IRouter } from "express";
import { db, submissionsTable, evaluationsTable, usersTable, activitiesTable } from "@workspace/db";
import { eq, count, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/submissions", async (req, res): Promise<void> => {
  const page = parseInt(String(req.query.page ?? "1"), 10);
  const limit = parseInt(String(req.query.limit ?? "20"), 10);
  const status = req.query.status as string | undefined;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (status) {
    conditions.push(eq(submissionsTable.status, status as "pending" | "under_review" | "jury_assigned" | "evaluated" | "approved" | "rejected" | "archived"));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [submissions, [{ value: total }]] = await Promise.all([
    db.select().from(submissionsTable).where(whereClause).orderBy(submissionsTable.submittedAt).limit(limit).offset(offset),
    db.select({ value: count() }).from(submissionsTable).where(whereClause),
  ]);

  res.json({
    submissions: submissions.map((s) => ({
      ...s,
      poetNameAr: s.poetNameAr ?? undefined,
      poetPhone: s.poetPhone ?? undefined,
      poetNationality: s.poetNationality ?? undefined,
      poemTitleAr: s.poemTitleAr ?? undefined,
      reviewerNotes: s.reviewerNotes ?? undefined,
      finalDecision: s.finalDecision ?? undefined,
      finalScore: s.finalScore ?? undefined,
      assignedJuryIds: [],
      evaluations: [],
    })),
    total: Number(total),
    page,
    limit,
  });
});

router.post("/submissions", async (req, res): Promise<void> => {
  const {
    poetName, poetNameAr, poetEmail, poetPhone, poetNationality,
    poemTitle, poemTitleAr, poemContent, poemType, competitionId,
  } = req.body;

  if (!poetName || !poetEmail || !poemTitle || !poemContent || !poemType) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }

  const refNum = `AHA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const [submission] = await db.insert(submissionsTable).values({
    referenceNumber: refNum,
    poetName,
    poetNameAr,
    poetEmail,
    poetPhone,
    poetNationality,
    poemTitle,
    poemTitleAr,
    poemContent,
    poemType,
    competitionId,
    status: "pending",
  }).returning();

  await db.insert(activitiesTable).values({
    type: "submission",
    title: "New poem submitted",
    description: `${poetName} submitted "${poemTitle}"`,
    actor: poetName,
    referenceId: submission.id,
  });

  res.status(201).json({
    ...submission,
    poetNameAr: submission.poetNameAr ?? undefined,
    poetPhone: submission.poetPhone ?? undefined,
    poetNationality: submission.poetNationality ?? undefined,
    poemTitleAr: submission.poemTitleAr ?? undefined,
    reviewerNotes: submission.reviewerNotes ?? undefined,
    finalDecision: submission.finalDecision ?? undefined,
    finalScore: submission.finalScore ?? undefined,
    assignedJuryIds: [],
    evaluations: [],
  });
});

router.get("/submissions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [submission] = await db.select().from(submissionsTable).where(eq(submissionsTable.id, id));
  if (!submission) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  const evals = await db
    .select({
      evaluation: evaluationsTable,
      juryName: usersTable.name,
    })
    .from(evaluationsTable)
    .leftJoin(usersTable, eq(evaluationsTable.juryMemberId, usersTable.id))
    .where(eq(evaluationsTable.submissionId, id));

  res.json({
    ...submission,
    poetNameAr: submission.poetNameAr ?? undefined,
    poetPhone: submission.poetPhone ?? undefined,
    poetNationality: submission.poetNationality ?? undefined,
    poemTitleAr: submission.poemTitleAr ?? undefined,
    reviewerNotes: submission.reviewerNotes ?? undefined,
    finalDecision: submission.finalDecision ?? undefined,
    finalScore: submission.finalScore ?? undefined,
    assignedJuryIds: [],
    evaluations: evals.map((e) => ({
      ...e.evaluation,
      juryMemberName: e.juryName ?? undefined,
      notes: e.evaluation.notes ?? undefined,
    })),
  });
});

router.patch("/submissions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { status, reviewerNotes, finalDecision } = req.body;

  const [submission] = await db.update(submissionsTable).set({
    ...(status && { status }),
    ...(reviewerNotes !== undefined && { reviewerNotes }),
    ...(finalDecision !== undefined && { finalDecision }),
    updatedAt: new Date(),
  }).where(eq(submissionsTable.id, id)).returning();

  if (!submission) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  if (status) {
    await db.insert(activitiesTable).values({
      type: "status_change",
      title: "Submission status updated",
      description: `Status changed to ${status}`,
      referenceId: id,
    });
  }

  res.json({
    ...submission,
    poetNameAr: submission.poetNameAr ?? undefined,
    poetPhone: submission.poetPhone ?? undefined,
    poetNationality: submission.poetNationality ?? undefined,
    poemTitleAr: submission.poemTitleAr ?? undefined,
    reviewerNotes: submission.reviewerNotes ?? undefined,
    finalDecision: submission.finalDecision ?? undefined,
    finalScore: submission.finalScore ?? undefined,
    assignedJuryIds: [],
    evaluations: [],
  });
});

router.post("/submissions/:id/assign-jury", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { juryMemberIds } = req.body;

  const [submission] = await db
    .update(submissionsTable)
    .set({ status: "jury_assigned", updatedAt: new Date() })
    .where(eq(submissionsTable.id, id))
    .returning();

  if (!submission) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  await db.insert(activitiesTable).values({
    type: "jury_assigned",
    title: "Jury assigned to submission",
    description: `${juryMemberIds?.length ?? 0} jury members assigned`,
    referenceId: id,
  });

  res.json({
    ...submission,
    assignedJuryIds: juryMemberIds ?? [],
    evaluations: [],
  });
});

export default router;
