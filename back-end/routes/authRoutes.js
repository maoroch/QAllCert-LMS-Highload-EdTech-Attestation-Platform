import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import {
    validateRegister,
    validateLogin,
    validateRefresh,
} from '../middlewares/validationMiddleware.js';

export const createAuthRouter = (authController) => {
    const router = Router();

    // authLimiter now applied to ALL four auth mutation endpoints — not just login
    router.post('/register', authLimiter, validateRegister, authController.register);
    router.post('/login',    authLimiter, validateLogin,    authController.login);
    router.post('/logout',   authLimiter, authController.logout);
    router.post('/refresh',  authLimiter, validateRefresh,  authController.refresh);
    router.post('/forgot-password', authLimiter, authController.forgotPassword);
    router.post('/reset-password',  authLimiter, authController.resetPassword);
    router.post('/verify-email',    authLimiter, authController.verifyEmail);
    router.get('/me',        authMiddleware, authController.me);

    return router;
};