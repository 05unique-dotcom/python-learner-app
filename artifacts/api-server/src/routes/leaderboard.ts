import { Router, type IRouter } from "express";
import { inArray, sql } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { computeUserPoints } from "../lib/points";
import { computeEarnedBadges } from "./badges";
import { getUserId } from "../lib/user";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res): Promise<void> => {
  const currentUserId = getUserId(req);

  const rows = await db.execute<{ user_id: string }>(
    sql`SELECT DISTINCT user_id FROM attempts`
  );
  const userIds = new Set(rows.rows.map((r) => r.user_id));
  userIds.add(currentUserId);

  const idList = [...userIds];

  const profiles = idList.length > 0
    ? await db.select().from(usersTable).where(inArray(usersTable.id, idList))
    : [];
  const nameByUser = new Map(profiles.map((p) => [p.id, p.displayName]));

  const entries = await Promise.all(
    idList.map(async (userId) => {
      const points = await computeUserPoints(userId);
      const badges = await computeEarnedBadges(userId);
      const savedName = nameByUser.get(userId);
      const displayName = savedName && savedName.trim().length > 0
        ? savedName
        : userId === currentUserId
          ? "You"
          : `Learner ${userId.slice(0, 4).toUpperCase()}`;

      return {
        userId,
        displayName,
        points: points.totalPoints,
        completedLessons: points.completedLessons,
        badgesEarned: badges.size,
        isYou: userId === currentUserId,
      };
    })
  );

  entries.sort((a, b) => b.points - a.points);

  res.json(entries.slice(0, 20));
});

export default router;
