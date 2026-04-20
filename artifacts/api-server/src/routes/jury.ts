import { Router, type IRouter } from "express";
import { db, usersTable, evaluationsTable, submissionsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/jury", async (_req, res): Promise<void> => {
  const juryUsers = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.role, "jury"));

  const juryWithStats = await Promise.all(
    juryUsers.map(async (user) => {
      const [{ value: completedEvaluations }] = await db
        .select({ value: count() })
        .from(evaluationsTable)
        .where(eq(evaluationsTable.juryMemberId, user.id));

      const [{ value: assignedSubmissions }] = await db
        .select({ value: count() })
        .from(submissionsTable)
        .where(eq(submissionsTable.status, "jury_assigned"));

      return {
        id: user.id,
        userId: user.id,
        name: user.name,
        nameAr: user.nameAr ?? undefined,
        email: user.email,
        specialization: user.bio ?? "Arabic Literature",
        specializations: ["Arabic Poetry", "Classical Literature"],
        assignedSubmissions: Number(assignedSubmissions),
        completedEvaluations: Number(completedEvaluations),
        avatarUrl: user.avatarUrl ?? undefined,
      };
    }),
  );

  res.json({
    juryMembers: juryWithStats,
    total: juryWithStats.length,
  });
});

export default router;
