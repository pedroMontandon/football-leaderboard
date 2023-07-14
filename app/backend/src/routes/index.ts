import { Router } from 'express';
import teamsRouter from './teams.routes';
import userRouter from './user.routes';
import matchesRouter from './matches.routes';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/login', userRouter);
router.use('/matches', matchesRouter);

export default router;
