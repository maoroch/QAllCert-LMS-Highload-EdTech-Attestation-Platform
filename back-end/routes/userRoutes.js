import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const createUserRouter = (userController) => {
    const router = Router();
    router.use(authMiddleware);
    router.get('/profile', userController.getProfile);
    router.patch('/profile', userController.updateProfile);
    return router;
};