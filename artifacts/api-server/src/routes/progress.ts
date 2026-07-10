import { Router, type IRouter } from "express";
import { and, eq, sql } from "drizzle-orm";
import { db, lessonsTable, challengesTable, attemptTable } from "@workspace/db";
import { getUserId } from "../lib/user";

const router: IRouter = Router();

router.get("/progress/summary", async (req, res): Promise<void> => {
  const userId = getUserId(req);

  const [totals] = await db
    .select({
      totalLessons: sql<number>`(SELECT COUNT(*)::int FROM lessons)`,
      totalChallenges: sql<number>`(SELECT COUNT(*)::int FROM challenges)`,
      correctAttempts: sql<number>`(SELECT COUNT(*)::int FROM attempts WHERE correct = true AND user_id = ${userId})`,
      totalAttempts: sql<number>`(SELECT COUNT(*)::int FROM attempts WHERE user_id = ${userId})`,
    })
    .from(sql`(SELECT 1) AS dummy`);

  const completedLessonsResult = await db
    .selectDistinct({ lessonId: attemptTable.lessonId })
    .from(attemptTable)
    .where(and(eq(attemptTable.correct, true), eq(attemptTable.userId, userId)));

  const completedChallengesResult = await db
    .selectDistinct({ challengeId: attemptTable.challengeId })
    .from(attemptTable)
    .where(and(eq(attemptTable.correct, true), eq(attemptTable.userId, userId)));

  res.json({
    totalLessons: totals?.totalLessons ?? 0,
    completedLessons: completedLessonsResult.length,
    totalChallenges: totals?.totalChallenges ?? 0,
    completedChallenges: completedChallengesResult.length,
    correctAttempts: totals?.correctAttempts ?? 0,
    totalAttempts: totals?.totalAttempts ?? 0,
  });
});

router.get("/progress/lessons", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const lessons = await db.select({ id: lessonsTable.id }).from(lessonsTable);

  const result = await Promise.all(
    lessons.map(async (lesson) => {
      const [stats] = await db
        .select({
          attemptCount: sql<number>`COUNT(*)::int`,
          correctChallenges: sql<number>`COUNT(DISTINCT CASE WHEN correct = true THEN challenge_id END)::int`,
        })
        .from(attemptTable)
        .where(and(eq(attemptTable.lessonId, lesson.id), eq(attemptTable.userId, userId)));

      const [challengeCount] = await db
        .select({ total: sql<number>`COUNT(*)::int` })
        .from(challengesTable)
        .where(eq(challengesTable.lessonId, lesson.id));

      const totalChallenges = challengeCount?.total ?? 0;
      const correctChallenges = stats?.correctChallenges ?? 0;

      return {
        lessonId: lesson.id,
        completed: totalChallenges > 0 && correctChallenges >= totalChallenges,
        correctChallenges,
        totalChallenges,
        attemptCount: stats?.attemptCount ?? 0,
      };
    })
  );

  res.json(result);
});

export default router;
