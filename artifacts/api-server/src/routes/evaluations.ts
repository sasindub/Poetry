import { Router, type IRouter } from "express";
import { db, evaluationsTable, usersTable, activitiesTable } from "@workspace/db";
import { eq, count, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/evaluations", async (req, res): Promise<void> => {
  const submissionId = req.query.submissionId ? parseInt(String(req.query.submissionId), 10) : undefined;
  const juryMemberId = req.query.juryMemberId ? parseInt(String(req.query.juryMemberId), 10) : undefined;

  const conditions = [];
  if (submissionId) conditions.push(eq(evaluationsTable.submissionId, submissionId));
  if (juryMemberId) conditions.push(eq(evaluationsTable.juryMemberId, juryMemberId));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [evals, [{ value: total }]] = await Promise.all([
    db
      .select({
        evaluation: evaluationsTable,
        juryName: usersTable.name,
      })
      .from(evaluationsTable)
      .leftJoin(usersTable, eq(evaluationsTable.juryMemberId, usersTable.id))
      .where(whereClause),
    db.select({ value: count() }).from(evaluationsTable).where(whereClause),
  ]);

  res.json({
    evaluations: evals.map((e) => ({
      ...e.evaluation,
      juryMemberName: e.juryName ?? undefined,
      notes: e.evaluation.notes ?? undefined,
    })),
    total: Number(total),
  });
});

router.post("/evaluations", async (req, res): Promise<void> => {
  const {
    submissionId, juryMemberId,
    linguisticScore, poeticScore, originalityScore, emotionalScore, culturalScore,
    notes, recommendation,
  } = req.body;

  if (!submissionId || !juryMemberId || recommendation == null) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }

  const totalScore = ((linguisticScore + poeticScore + originalityScore + emotionalScore + culturalScore) / 5);

  const [evaluation] = await db.insert(evaluationsTable).values({
    submissionId,
    juryMemberId,
    linguisticScore,
    poeticScore,
    originalityScore,
    emotionalScore,
    culturalScore,
    totalScore,
    notes,
    recommendation,
  }).returning();

  await db.insert(activitiesTable).values({
    type: "evaluation",
    title: "Evaluation submitted",
    description: `Jury member submitted evaluation with score ${totalScore.toFixed(1)}`,
    referenceId: submissionId,
  });

  res.status(201).json({
    ...evaluation,
    notes: evaluation.notes ?? undefined,
  });
});

export default router;
