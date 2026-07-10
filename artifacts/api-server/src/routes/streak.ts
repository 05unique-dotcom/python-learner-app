import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, attemptTable } from "@workspace/db";
import { getUserId } from "../lib/user";

const router: IRouter = Router();

function toLocalDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

router.get("/streak", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  // Get all distinct activity dates (UTC) from attempts
  const rows = await db.execute<{ date: string }>(
    sql`SELECT DISTINCT DATE(created_at AT TIME ZONE 'UTC')::text AS date FROM attempts WHERE user_id = ${userId} ORDER BY date`
  );

  const activeDates = new Set(rows.rows.map((r) => r.date));
  const today = toLocalDateStr(new Date());

  // Build last 30 days of activity for heatmap
  const monthActivity: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toLocalDateStr(d);
    monthActivity.push({ date: dateStr, count: activeDates.has(dateStr) ? 1 : 0 });
  }

  // Build last 7 days for week strip
  const weekActivity: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weekActivity.push(activeDates.has(toLocalDateStr(d)));
  }

  const todayCompleted = activeDates.has(today);

  // Compute current streak (consecutive days ending today or yesterday)
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

  // Compute longest streak from all active dates
  const sortedDates = [...activeDates].sort();
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;
  for (const dateStr of sortedDates) {
    const cur = new Date(dateStr + "T12:00:00Z");
    if (prevDate) {
      const diff = (cur.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === 1) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    } else {
      runningStreak = 1;
    }
    if (runningStreak > longestStreak) longestStreak = runningStreak;
    prevDate = cur;
  }

  const lastActivityDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;

  res.json({
    currentStreak,
    longestStreak,
    todayCompleted,
    lastActivityDate,
    totalActiveDays: activeDates.size,
    weekActivity,
    monthActivity,
  });
});

export default router;
