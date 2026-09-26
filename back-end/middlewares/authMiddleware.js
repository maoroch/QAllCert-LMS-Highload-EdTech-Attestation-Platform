import { verifyAccessToken } from '../utils/jwt.js';
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        // Проверка черного списка в Redis (если есть)
        const redisClient = req.redis;
        if (redisClient && await redisClient.get(`blacklist:${token}`)) {
            return res.status(401).json({ message: 'Token revoked' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
