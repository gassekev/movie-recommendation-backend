/**
 * @summary   Utility functions
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import crypto from 'crypto';
import config from 'config';
import nodemailer from 'nodemailer';

export const generateRandomId = length => crypto.randomBytes(length).toString('hex');

export const smtpTransporter = nodemailer.createTransport({
  host: config.get('smtp.host'),
  port: config.get('smtp.port'),
  auth: {
    user: config.get('smtp.auth.user'),
    pass: config.get('smtp.auth.password'),
  },
});
