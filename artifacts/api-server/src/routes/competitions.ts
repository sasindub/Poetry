import { Router, type IRouter } from "express";
import { db, competitionsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/competitions", async (_req, res): Promise<void> => {
  const [competitions, [{ value: total }]] = await Promise.all([
    db.select().from(competitionsTable).orderBy(competitionsTable.startDate),
    db.select({ value: count() }).from(competitionsTable),
  ]);

  res.json({
    competitions: competitions.map((c) => ({
      ...c,
      titleAr: c.titleAr ?? undefined,
      description: c.description ?? undefined,
      descriptionAr: c.descriptionAr ?? undefined,
    })),
    total: Number(total),
  });
});

router.post("/competitions", async (req, res): Promise<void> => {
  const { title, titleAr, description, descriptionAr, startDate, endDate } = req.body;

  if (!title || !startDate || !endDate) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }

  const [competition] = await db.insert(competitionsTable).values({
    title,
    titleAr,
    description,
    descriptionAr,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    status: "upcoming",
  }).returning();

  res.status(201).json(competition);
});

export default router;
