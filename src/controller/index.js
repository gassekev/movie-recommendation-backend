import { Router } from 'express';
import userRouter from './router/user';
import movieRouter from './router/movie';
import authRouter from './router/auth';
import { validateUserToken } from './middleware/auth';
import errorHandlerMiddleware from './middleware/error';

const router = new Router();

router.use('/api/user', validateUserToken, userRouter);
router.use('/api/movie', validateUserToken, movieRouter);
router.use('/api/auth', authRouter);

router.use(errorHandlerMiddleware);

export default router;
