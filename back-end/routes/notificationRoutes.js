import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const createNotificationRouter = (notificationService) => {
    const router = Router();
    router.use(authMiddleware);

    // GET /api/notifications — list notifications for current user
    router.get('/', async (req, res, next) => {
        try {
            const notifications = await notificationService.getForUser(req.user.id);
            res.json(notifications);
        } catch (err) { next(err); }
    });

    // GET /api/notifications/unread-count
    router.get('/unread-count', async (req, res, next) => {
        try {
            const count = await notificationService.getUnreadCount(req.user.id);
            res.json({ count });
        } catch (err) { next(err); }
    });

    // PATCH /api/notifications/read-all — mark all read
    router.patch('/read-all', async (req, res, next) => {
        try {
            await notificationService.markAllRead(req.user.id);
            res.json({ message: 'All notifications marked as read' });
        } catch (err) { next(err); }
    });

    // PATCH /api/notifications/:id/read — mark one read
    router.patch('/:id/read', async (req, res, next) => {
        try {
            await notificationService.markOneRead(req.params.id, req.user.id);
            res.json({ message: 'Notification marked as read' });
        } catch (err) { next(err); }
    });

    return router;
};