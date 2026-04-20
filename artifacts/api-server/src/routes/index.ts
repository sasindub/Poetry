import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import submissionsRouter from "./submissions";
import juryRouter from "./jury";
import evaluationsRouter from "./evaluations";
import dashboardRouter from "./dashboard";
import competitionsRouter from "./competitions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(submissionsRouter);
router.use(juryRouter);
router.use(evaluationsRouter);
router.use(dashboardRouter);
router.use(competitionsRouter);

export default router;
