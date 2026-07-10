import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, lessonsTable, challengesTable, attemptTable } from "@workspace/db";
import { getUserId } from "../lib/user";

const router: IRouter = Router();

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: "first_answer",
    name: "First Answer",
    description: "Submit your very first challenge answer",
    icon: "zap",
  },
  {
    id: "first_lesson",
    name: "Lesson Complete",
    description: "Complete all challenges in a lesson",
    icon: "book-check",
  },
  {
    id: "perfect_lesson",
    name: "Perfect Score",
    description: "Answer every challenge in a lesson correctly on the first try",
    icon: "star",
  },
  {
    id: "halfway",
    name: "Halfway There",
    description: "Complete 3 or more lessons",
    icon: "trending-up",
  },
  {
    id: "python_master",
    name: "Python Master",
    description: "Complete every lesson in the curriculum",
    icon: "trophy",
  },
  {
    id: "sharp_mind",
    name: "Sharp Mind",
    description: "Achieve 90% or higher overall accuracy (minimum 10 attempts)",
    icon: "brain",
  },
  {
    id: "challenger",
    name: "Challenger",
    description: "Answer 10 or more challenges correctly",
    icon: "shield-check",
  },
  {
    id: "streak_3",
    name: "3-Day Streak",
    description: "Practice Python 3 days in a row",
    icon: "flame",
  },
  {
    id: "streak_7",
    name: "7-Day Streak",
    description: "Practice Python 7 days in a row",
    icon: "flame",
  },
];

async function computeEarnedBadges(userId: string): Promise<Map<string, string>> {
  const earned = new Map<string, string>();
  const now = new Date().toISOString();

  // first_answer: any attempt submitted
  const [anyAttempt] = await db
    .select({ createdAt: attemptTable.createdAt })
    .from(attemptTable)
    .where(eq(attemptTable.userId, userId))
    .orderBy(attemptTable.createdAt)
    .limit(1);
  if (anyAttempt) {
    earned.set("first_answer", anyAttempt.createdAt.toISOString());
  }

  // first_lesson: at least one completed lesson
  const lessons = await db.select({ id: lessonsTable.id }).from(lessonsTable);
  const challengeCounts = await Promise.all(
    lessons.map(async (l) => {
      const [cnt] = await db
        .select({ total: sql<number>`COUNT(*)::int` })
        .from(challengesTable)
        .where(eq(challengesTable.lessonId, l.id));
      return { lessonId: l.id, total: cnt?.total ?? 0 };
    })
  );

  const completedLessons: number[] = [];
  for (const { lessonId, total } of challengeCounts) {
    if (total === 0) continue;
    const [correct] = await db
      .select({ cnt: sql<number>`COUNT(DISTINCT challenge_id)::int` })
      .from(attemptTable)
      .where(
        sql`${attemptTable.lessonId} = ${lessonId} AND ${attemptTable.correct} = true AND ${attemptTable.userId} = ${userId}`
      );
    if ((correct?.cnt ?? 0) >= total) {
      completedLessons.push(lessonId);
    }
  }

  if (completedLessons.length >= 1) {
    const [firstCompletion] = await db
      .select({ createdAt: attemptTable.createdAt })
      .from(attemptTable)
      .where(
        sql`${attemptTable.lessonId} = ${completedLessons[0]} AND ${attemptTable.correct} = true AND ${attemptTable.userId} = ${userId}`
      )
      .orderBy(attemptTable.createdAt)
      .limit(1);
    earned.set("first_lesson", firstCompletion?.createdAt.toISOString() ?? now);
  }

  if (completedLessons.length >= 3) {
    earned.set("halfway", now);
  }

  if (completedLessons.length >= lessons.length && lessons.length > 0) {
    earned.set("python_master", now);
  }

  // perfect_lesson: all challenges in one lesson answered correctly with no wrong attempts
  for (const { lessonId, total } of challengeCounts) {
    if (total === 0) continue;
    const [wrongCount] = await db
      .select({ cnt: sql<number>`COUNT(*)::int` })
      .from(attemptTable)
      .where(
        sql`${attemptTable.lessonId} = ${lessonId} AND ${attemptTable.correct} = false AND ${attemptTable.userId} = ${userId}`
      );
    const [correctCount] = await db
      .select({ cnt: sql<number>`COUNT(DISTINCT challenge_id)::int` })
      .from(attemptTable)
      .where(
        sql`${attemptTable.lessonId} = ${lessonId} AND ${attemptTable.correct} = true AND ${attemptTable.userId} = ${userId}`
      );
    if ((wrongCount?.cnt ?? 0) === 0 && (correctCount?.cnt ?? 0) >= total) {
      earned.set("perfect_lesson", now);
      break;
    }
  }

  // sharp_mind: >= 90% accuracy with >= 10 attempts
  const [summary] = await db
    .select({
      total: sql<number>`COUNT(*)::int`,
      correct: sql<number>`COUNT(CASE WHEN correct = true THEN 1 END)::int`,
    })
    .from(attemptTable)
    .where(eq(attemptTable.userId, userId));
  const totalAttempts = summary?.total ?? 0;
  const correctAttempts = summary?.correct ?? 0;
  if (totalAttempts >= 10 && correctAttempts / totalAttempts >= 0.9) {
    earned.set("sharp_mind", now);
  }

  // challenger: 10 or more correct attempts
  if (correctAttempts >= 10) {
    earned.set("challenger", now);
  }

  // streak_3 / streak_7: compute longest streak from attempt dates
  const dateRows = await db.execute<{ date: string }>(
    sql`SELECT DISTINCT DATE(created_at AT TIME ZONE 'UTC')::text AS date FROM attempts WHERE user_id = ${userId} ORDER BY date`
  );
  const sortedDates = dateRows.rows.map((r) => r.date);
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;
  for (const dateStr of sortedDates) {
    const cur = new Date(dateStr + "T12:00:00Z");
    if (prevDate) {
      const diff = (cur.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      runningStreak = Math.round(diff) === 1 ? runningStreak + 1 : 1;
    } else {
      runningStreak = 1;
    }
    if (runningStreak > longestStreak) longestStreak = runningStreak;
    prevDate = cur;
  }
  if (longestStreak >= 3) earned.set("streak_3", now);
  if (longestStreak >= 7) earned.set("streak_7", now);

  return earned;
}

router.get("/badges", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const earned = await computeEarnedBadges(userId);

  const badges = BADGE_DEFS.map((def) => ({
    ...def,
    earned: earned.has(def.id),
    earnedAt: earned.get(def.id) ?? null,
  }));

  res.json(badges);
});

export { computeEarnedBadges, BADGE_DEFS };
export default router;
