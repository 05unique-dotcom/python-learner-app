import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, challengesTable, attemptTable } from "@workspace/db";
import {
  SubmitAttemptParams,
  SubmitAttemptBody,
} from "@workspace/api-zod";
import { getUserId } from "../lib/user";

const router: IRouter = Router();

router.get("/challenges/quick", async (req, res): Promise<void> => {
  const rawCount = Array.isArray(req.query.count) ? req.query.count[0] : req.query.count;
  const parsedCount = parseInt(String(rawCount ?? "10"), 10);
  const count = Number.isFinite(parsedCount) && parsedCount > 0 ? Math.min(parsedCount, 50) : 10;

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
    .orderBy(sql`random()`)
    .limit(count);

  res.json(challenges);
});

router.post("/challenges/:id/attempt", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = SubmitAttemptParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = SubmitAttemptBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [challenge] = await db
    .select()
    .from(challengesTable)
    .where(eq(challengesTable.id, params.data.id));

  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  const correct = body.data.answer.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase();
  const userId = getUserId(req);

  await db.insert(attemptTable).values({
    userId,
    challengeId: challenge.id,
    lessonId: challenge.lessonId,
    answer: body.data.answer,
    correct,
  });

  res.json({
    correct,
    explanation: challenge.explanation,
    correctAnswer: challenge.correctAnswer,
  });
});

export default router;
