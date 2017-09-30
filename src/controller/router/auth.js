import { Router } from 'express';
import httpStatus from 'http-status';
import { validateLoginUserData, validateRegisterUserData,
  findUser, validateUserPassword, createUserToken, hashUserPassword,
  createUser } from '../middleware/auth';

const router = new Router();

router.post('/login', validateLoginUserData, findUser, validateUserPassword,
  createUserToken, (req, res) =>
    res.json({ token: res.locals.token }));

router.post('/register', validateRegisterUserData, hashUserPassword, createUser,
  (req, res) =>
    res.sendStatus(httpStatus.CREATED));

export default router;
