import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { getUserId } from "../lib/user";

const router: IRouter = Router();

router.put("/me", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const displayName = typeof req.body?.displayName === "string" ? req.body.displayName.trim().slice(0, 60) : "";

  if (!displayName) {
    res.status(400).json({ error: "displayName is required" });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (existing) {
    await db
      .update(usersTable)
      .set({ displayName, updatedAt: new Date() })
      .where(eq(usersTable.id, userId));
  } else {
    await db.insert(usersTable).values({ id: userId, displayName });
  }

  res.json({ userId, displayName });
});

export default router;
