import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, count, like, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/users", async (req, res): Promise<void> => {
  const page = parseInt(String(req.query.page ?? "1"), 10);
  const limit = parseInt(String(req.query.limit ?? "20"), 10);
  const role = req.query.role as string | undefined;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (role) {
    conditions.push(eq(usersTable.role, role as "admin" | "reviewer" | "jury" | "poet"));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [users, [{ value: total }]] = await Promise.all([
    db.select().from(usersTable).where(whereClause).limit(limit).offset(offset),
    db.select({ value: count() }).from(usersTable).where(whereClause),
  ]);

  res.json({
    users: users.map((u) => {
      const { passwordHash: _ph, ...rest } = u;
      return rest;
    }),
    total: Number(total),
    page,
    limit,
  });
});

router.post("/users", async (req, res): Promise<void> => {
  const { name, nameAr, email, password, role, phone, nationality, bio, bioAr } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }

  const [user] = await db.insert(usersTable).values({
    name,
    nameAr,
    email,
    passwordHash: password,
    role,
    phone,
    nationality,
    bio,
    bioAr,
  }).returning();

  const { passwordHash: _ph, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
});

router.get("/users/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _ph, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.patch("/users/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { name, nameAr, email, role, status, phone, nationality, bio, bioAr } = req.body;

  const [user] = await db.update(usersTable).set({
    ...(name && { name }),
    ...(nameAr !== undefined && { nameAr }),
    ...(email && { email }),
    ...(role && { role }),
    ...(status && { status }),
    ...(phone !== undefined && { phone }),
    ...(nationality !== undefined && { nationality }),
    ...(bio !== undefined && { bio }),
    ...(bioAr !== undefined && { bioAr }),
    updatedAt: new Date(),
  }).where(eq(usersTable.id, id)).returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _ph, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.delete("/users/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [user] = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
