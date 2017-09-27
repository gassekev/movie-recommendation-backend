import { Router } from 'express';
import userRouter from './router/user';
import authRouter from './router/auth';
import authMiddleware from './middleware/auth';
import errorHandlerMiddleware from './middleware/error';

const router = new Router();

router.use('/api/user', authMiddleware, userRouter);
router.use('/api/auth', authRouter);

router.use(errorHandlerMiddleware);

export default router;
