import { eq, sql } from "drizzle-orm";
import { db, lessonsTable, challengesTable, attemptTable } from "@workspace/db";

function toLocalDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getCurrentStreak(userId: string): Promise<number> {
  const rows = await db.execute<{ date: string }>(
    sql`SELECT DISTINCT DATE(created_at AT TIME ZONE 'UTC')::text AS date FROM attempts WHERE user_id = ${userId} ORDER BY date`
  );
  const activeDates = new Set(rows.rows.map((r) => r.date));
  const today = toLocalDateStr(new Date());
  const todayCompleted = activeDates.has(today);

  let currentStreak = 0;
  const checkFrom = todayCompleted ? 0 : 1;
  for (let i = checkFrom; ; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (activeDates.has(toLocalDateStr(d))) {
      currentStreak++;
    } else {
      break;
    }
  }
  return currentStreak;
}

export interface PointsBreakdown {
  lessonPoints: number;
  quizPoints: number;
  streakPoints: number;
  courseBonus: number;
  totalPoints: number;
  completedLessons: number;
  totalLessons: number;
  currentStreak: number;
}

export async function computeUserPoints(userId: string): Promise<PointsBreakdown> {
  const lessons = await db.select({ id: lessonsTable.id }).from(lessonsTable);
  const totalLessons = lessons.length;

  let lessonPoints = 0;
  let quizPoints = 0;
  let completedLessons = 0;

  for (const lesson of lessons) {
    const [challengeCount] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(challengesTable)
      .where(eq(challengesTable.lessonId, lesson.id));
    const total = challengeCount?.total ?? 0;
    if (total === 0) continue;

    const [correctRow] = await db
      .select({ cnt: sql<number>`COUNT(DISTINCT challenge_id)::int` })
      .from(attemptTable)
      .where(
        sql`${attemptTable.lessonId} = ${lesson.id} AND ${attemptTable.correct} = true AND ${attemptTable.userId} = ${userId}`
      );
    const correct = correctRow?.cnt ?? 0;
    const ratio = total > 0 ? correct / total : 0;

    if (ratio >= 1) {
      completedLessons++;
      lessonPoints += 50;
      quizPoints += 150;
    } else if (ratio > 0.7) {
      quizPoints += 100;
    }
  }

  const currentStreak = await getCurrentStreak(userId);
  const streakPoints = currentStreak * 25;

  const courseBonus = totalLessons > 0 && completedLessons >= totalLessons ? 500 : 0;

  const totalPoints = lessonPoints + quizPoints + streakPoints + courseBonus;

  return {
    lessonPoints,
    quizPoints,
    streakPoints,
    courseBonus,
    totalPoints,
    completedLessons,
    totalLessons,
    currentStreak,
  };
}

export interface RewardDef {
  id: string;
  name: string;
  icon: string;
  threshold: number;
  description: string;
}

export const REWARD_DEFS: RewardDef[] = [
  {
    id: "bronze_key",
    name: "Bronze Key",
    icon: "key",
    threshold: 200,
    description: "Unlocks bonus practice exercises",
  },
  {
    id: "silver_key",
    name: "Silver Key",
    icon: "key",
    threshold: 500,
    description: "Unlocks advanced tips & tricks",
  },
  {
    id: "gold_key",
    name: "Gold Key",
    icon: "key",
    threshold: 1000,
    description: "Unlocks certificate + special badge",
  },
  {
    id: "champion_prize",
    name: "Champion Prize",
    icon: "trophy",
    threshold: 2000,
    description: "Unlocks exclusive Python project ideas",
  },
];
