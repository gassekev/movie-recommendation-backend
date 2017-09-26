import { Router } from 'express';
import movieRouter from './router/movie';
import authRouter from './router/auth';
import authMiddleware from './middleware/auth';

const router = new Router();

router.use('/api/user', authMiddleware, movieRouter);
router.use('/api/auth', authRouter);

export default router;
