import { Router, type IRouter } from "express";
import healthRouter from "./health";
import lessonsRouter from "./lessons";
import challengesRouter from "./challenges";
import progressRouter from "./progress";

const router: IRouter = Router();

router.use(healthRouter);
router.use(lessonsRouter);
router.use(challengesRouter);
router.use(progressRouter);

export default router;
