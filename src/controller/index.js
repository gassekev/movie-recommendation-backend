/**
 * @summary   Appends the specific routers to their path and adds errorhandling
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import { Router } from 'express';
import userRouter from './router/userRouter';
import movieRouter from './router/movieRouter';
import authRouter from './router/authRouter';
import { validateUserToken } from './middleware/authMiddleware';
import errorHandlerMiddleware from './middleware/errorMiddleware';

const router = new Router();

router.use('/api/user', validateUserToken, userRouter);
router.use('/api/movie', validateUserToken, movieRouter);
router.use('/api/auth', authRouter);

router.use(errorHandlerMiddleware);

export default router;
