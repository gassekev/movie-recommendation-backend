import crypto from 'crypto';

export const generateRandomId = length => crypto.randomBytes(length).toString('hex');
