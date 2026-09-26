import crypto from 'crypto';
export const generateVerificationCode = () => crypto.randomBytes(16).toString('hex');