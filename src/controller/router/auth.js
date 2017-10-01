import { Router } from 'express';
import httpStatus from 'http-status';
import { validateLoginUserData, validateRegisterUserData,
  findUser, validateUserPassword, createUserToken, hashUserPassword,
  createUser, validateUserToken, revokeUserToken } from '../middleware/auth';

const router = new Router();

router.post('/login', validateLoginUserData, findUser, validateUserPassword,
  createUserToken, (req, res) =>
    res.json({ token: res.locals.token }));

router.post('/register', validateRegisterUserData, hashUserPassword, createUser,
  (req, res) =>
    res.sendStatus(httpStatus.CREATED));

router.post('/logout', validateUserToken, revokeUserToken, (req, res) =>
  res.sendStatus(httpStatus.OK));

export default router;
