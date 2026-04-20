import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const validPasswords: Record<string, string> = {
    "admin@aha.ae": "admin123",
    "reviewer@aha.ae": "reviewer123",
    "jury@aha.ae": "jury123",
    "jury2@aha.ae": "jury123",
    "poet@aha.ae": "poet123",
  };

  const expectedPassword = validPasswords[email];
  if (!expectedPassword || password !== expectedPassword) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString("base64");

  const { passwordHash: _ph, ...userWithoutPassword } = user;

  res.json({
    user: {
      ...userWithoutPassword,
      nameAr: user.nameAr ?? undefined,
      phone: user.phone ?? undefined,
      nationality: user.nationality ?? undefined,
      bio: user.bio ?? undefined,
      bioAr: user.bioAr ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
    },
    token,
  });
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.json({ success: true });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId] = decoded.split(":");
    const id = parseInt(userId, 10);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const { passwordHash: _ph, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      nameAr: user.nameAr ?? undefined,
      phone: user.phone ?? undefined,
      nationality: user.nationality ?? undefined,
      bio: user.bio ?? undefined,
      bioAr: user.bioAr ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
    });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
