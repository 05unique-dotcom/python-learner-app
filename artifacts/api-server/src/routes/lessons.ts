import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, lessonsTable, challengesTable } from "@workspace/db";
import {
  GetLessonParams,
  GetLessonChallengesParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/lessons", async (_req, res): Promise<void> => {
  const lessons = await db
    .select({
      id: lessonsTable.id,
      title: lessonsTable.title,
      description: lessonsTable.description,
      order: lessonsTable.order,
      difficulty: lessonsTable.difficulty,
      totalChallenges: sql<number>`(
        SELECT COUNT(*)::int FROM challenges WHERE lesson_id = ${lessonsTable.id}
      )`,
    })
    .from(lessonsTable)
    .orderBy(lessonsTable.order);

  res.json(lessons);
});

router.get("/lessons/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetLessonParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lesson] = await db
    .select({
      id: lessonsTable.id,
      title: lessonsTable.title,
      description: lessonsTable.description,
      order: lessonsTable.order,
      difficulty: lessonsTable.difficulty,
      content: lessonsTable.content,
      totalChallenges: sql<number>`(
        SELECT COUNT(*)::int FROM challenges WHERE lesson_id = ${lessonsTable.id}
      )`,
    })
    .from(lessonsTable)
    .where(eq(lessonsTable.id, parsed.data.id));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json(lesson);
});

router.get("/lessons/:id/challenges", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetLessonChallengesParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const challenges = await db
    .select({
      id: challengesTable.id,
      lessonId: challengesTable.lessonId,
      question: challengesTable.question,
      type: challengesTable.type,
      options: challengesTable.options,
      explanation: challengesTable.explanation,
    })
    .from(challengesTable)
    .where(eq(challengesTable.lessonId, parsed.data.id))
    .orderBy(challengesTable.id);

  res.json(challenges);
});

export default router;
