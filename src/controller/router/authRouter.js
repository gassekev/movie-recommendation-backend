import { Router } from 'express';
import httpStatus from 'http-status';
import {
  checkLoginUserData,
  checkRegisterUserData,
  findUserByUsername,
  findUserByEmail,
  checkResetEmail,
  checkResetUserData,
  createUserResetToken,
  validateUserPassword,
  validateUserResetToken,
  createUserToken,
  saveUser,
  sendResetEmail,
  unsetResetToken,
  hashUserPassword,
  createUser,
  validateUserToken,
  revokeUserToken } from '../middleware/authMiddleware';
import { checkValidationResult } from '../middleware/validationMiddleware';
import { sanitizeBodyUsername, sanitizeBodyEmail } from '../middleware/sanitizeMiddleware';

const router = new Router();

router.post('/login',
  sanitizeBodyUsername,
  ...checkLoginUserData,
  checkValidationResult,
  findUserByUsername,
  validateUserPassword,
  createUserToken,
  unsetResetToken,
  saveUser, (req, res) =>
    res.json({ token: res.locals.token }));

router.post('/register',
  sanitizeBodyUsername,
  sanitizeBodyEmail,
  ...checkRegisterUserData,
  checkValidationResult,
  hashUserPassword,
  createUser, (req, res) =>
    res.sendStatus(httpStatus.CREATED));

router.post('/logout',
  validateUserToken,
  revokeUserToken, (req, res) =>
    res.sendStatus(httpStatus.OK));

router.post('/set-password',
  sanitizeBodyUsername,
  ...checkResetUserData,
  checkValidationResult,
  findUserByUsername,
  validateUserResetToken,
  unsetResetToken,
  hashUserPassword,
  saveUser, (req, res) =>
    res.sendStatus(httpStatus.OK));

router.post('/reset-password',
  sanitizeBodyEmail,
  ...checkResetEmail,
  checkValidationResult,
  findUserByEmail,
  createUserResetToken,
  sendResetEmail,
  saveUser, (req, res) =>
    res.sendStatus(httpStatus.OK));

export default router;
