/**
 * @summary   Middleware that does the sanitization
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import { sanitizeBody, sanitizeParam } from 'express-validator/filter';

const curlyBraces = '{}';

export const sanitizeBodyUsername =
  sanitizeBody('username')
    .blacklist(curlyBraces);

export const sanitizeBodyEmail =
  sanitizeBody('email')
    .blacklist(curlyBraces);

export const sanitizeParamUsername =
  sanitizeParam('username')
    .blacklist(curlyBraces);
