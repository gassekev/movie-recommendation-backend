import { Router } from 'express';
import userRouter from './router/user';
import authRouter from './router/auth';
import authMiddleware from './middleware/auth';

const router = new Router();

router.use('/api/user', authMiddleware, userRouter);
router.use('/api/auth', authRouter);

export default router;
