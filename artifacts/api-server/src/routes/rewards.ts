import { Router, type IRouter } from "express";
import { computeUserPoints, REWARD_DEFS } from "../lib/points";
import { getUserId } from "../lib/user";

const router: IRouter = Router();

router.get("/rewards", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const points = await computeUserPoints(userId);

  const rewards = REWARD_DEFS.map((def) => ({
    ...def,
    unlocked: points.totalPoints >= def.threshold,
  }));

  const locked = REWARD_DEFS.filter((def) => points.totalPoints < def.threshold);
  const nextRewardDef = locked.length > 0 ? locked[0] : null;
  const nextReward = nextRewardDef
    ? { ...nextRewardDef, unlocked: false }
    : null;
  const pointsToNextReward = nextRewardDef ? nextRewardDef.threshold - points.totalPoints : 0;

  const prevThreshold = nextRewardDef
    ? (REWARD_DEFS[REWARD_DEFS.indexOf(nextRewardDef) - 1]?.threshold ?? 0)
    : (REWARD_DEFS[REWARD_DEFS.length - 1]?.threshold ?? 0);
  const progressToNextReward = nextRewardDef
    ? Math.min(
        100,
        Math.max(
          0,
          ((points.totalPoints - prevThreshold) / (nextRewardDef.threshold - prevThreshold)) * 100
        )
      )
    : 100;

  res.json({
    totalPoints: points.totalPoints,
    lessonPoints: points.lessonPoints,
    quizPoints: points.quizPoints,
    streakPoints: points.streakPoints,
    courseBonus: points.courseBonus,
    currentStreak: points.currentStreak,
    completedLessons: points.completedLessons,
    totalLessons: points.totalLessons,
    rewards,
    nextReward,
    pointsToNextReward,
    progressToNextReward,
  });
});

export default router;
