import { Router, type IRouter } from "express";
import healthRouter from "./health";
import lessonsRouter from "./lessons";
import challengesRouter from "./challenges";
import progressRouter from "./progress";
import badgesRouter from "./badges";
import certificateRouter from "./certificate";
import streakRouter from "./streak";
import rewardsRouter from "./rewards";
import leaderboardRouter from "./leaderboard";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(lessonsRouter);
router.use(challengesRouter);
router.use(progressRouter);
router.use(badgesRouter);
router.use(certificateRouter);
router.use(streakRouter);
router.use(rewardsRouter);
router.use(leaderboardRouter);
router.use(usersRouter);

export default router;
