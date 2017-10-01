import { Router } from 'express';
import httpStatus from 'http-status';
import {
  validateLoginUserData,
  validateRegisterUserData,
  findUserByUsername,
  findUserByEmail,
  validateResetEmail,
  validateResetUserData,
  createUserResetToken,
  validateUserPassword,
  validateUserResetToken,
  createUserToken,
  saveUser,
  unsetResetToken,
  hashUserPassword,
  createUser,
  validateUserToken,
  revokeUserToken } from '../middleware/auth';

const router = new Router();

router.post('/login', validateLoginUserData, findUserByUsername, validateUserPassword,
  createUserToken, unsetResetToken, saveUser, (req, res) =>
    res.json({ token: res.locals.token }));

router.post('/register', validateRegisterUserData, hashUserPassword, createUser,
  (req, res) =>
    res.sendStatus(httpStatus.CREATED));

router.post('/logout', validateUserToken, revokeUserToken, (req, res) =>
  res.sendStatus(httpStatus.OK));

router.post('/set-password', validateResetUserData, findUserByUsername, validateUserResetToken,
  hashUserPassword, saveUser, (req, res) =>
    res.sendStatus(httpStatus.OK));

router.post('/reset-password', validateResetEmail, findUserByEmail, createUserResetToken,
  saveUser, (req, res) =>
    res.sendStatus(httpStatus.OK));

export default router;
