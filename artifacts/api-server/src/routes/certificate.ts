import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, lessonsTable, challengesTable, attemptTable } from "@workspace/db";
import { computeEarnedBadges } from "./badges";

const router: IRouter = Router();

router.get("/certificate", async (_req, res): Promise<void> => {
  const lessons = await db.select({ id: lessonsTable.id }).from(lessonsTable);
  const totalLessons = lessons.length;

  const [attemptSummary] = await db
    .select({
      totalAttempts: sql<number>`COUNT(*)::int`,
      correctAttempts: sql<number>`COUNT(CASE WHEN correct = true THEN 1 END)::int`,
    })
    .from(attemptTable);

  const totalAttempts = attemptSummary?.totalAttempts ?? 0;
  const correctAttempts = attemptSummary?.correctAttempts ?? 0;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const [challengeTotal] = await db
    .select({ total: sql<number>`COUNT(*)::int` })
    .from(challengesTable);
  const totalChallenges = challengeTotal?.total ?? 0;

  const [completedChallengeResult] = await db
    .select({ cnt: sql<number>`COUNT(DISTINCT challenge_id)::int` })
    .from(attemptTable)
    .where(eq(attemptTable.correct, true));
  const completedChallenges = completedChallengeResult?.cnt ?? 0;

  // Check each lesson is complete
  let completedLessons = 0;
  let lastCompletionAt: Date | null = null;
  for (const lesson of lessons) {
    const [cntRow] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(challengesTable)
      .where(eq(challengesTable.lessonId, lesson.id));
    const lessonTotal = cntRow?.total ?? 0;
    if (lessonTotal === 0) continue;

    const [correctRow] = await db
      .select({ cnt: sql<number>`COUNT(DISTINCT challenge_id)::int` })
      .from(attemptTable)
      .where(
        sql`${attemptTable.lessonId} = ${lesson.id} AND ${attemptTable.correct} = true`
      );
    if ((correctRow?.cnt ?? 0) >= lessonTotal) {
      completedLessons++;
      // Get last correct attempt for this lesson
      const [lastAttempt] = await db
        .select({ createdAt: attemptTable.createdAt })
        .from(attemptTable)
        .where(
          sql`${attemptTable.lessonId} = ${lesson.id} AND ${attemptTable.correct} = true`
        )
        .orderBy(sql`created_at DESC`)
        .limit(1);
      if (lastAttempt && (!lastCompletionAt || lastAttempt.createdAt > lastCompletionAt)) {
        lastCompletionAt = lastAttempt.createdAt;
      }
    }
  }

  const earned = totalLessons > 0 && completedLessons >= totalLessons;
  const earnedBadges = await computeEarnedBadges();

  res.json({
    earned,
    completedAt: lastCompletionAt ? lastCompletionAt.toISOString() : null,
    totalLessons,
    completedLessons,
    totalChallenges,
    completedChallenges,
    accuracy,
    badgesEarned: earnedBadges.size,
  });
});

export default router;
