export const cacheMiddleware = (ttlSeconds = 60) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        const redis = req.redis;
        if (!redis) return next();

        // Skip cache for teachers to show real-time changes
        if (req.user && req.user.role === 'teacher') {
            return next();
        }

        try {
            const cached = await redis.get(key);
            if (cached) {
                return res.json(JSON.parse(cached));
            }
            res.sendResponse = res.json;
            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redis.setEx(key, ttlSeconds, JSON.stringify(body));
                }
                res.sendResponse(body);
            };
            next();
        } catch (err) {
            next();
        }
    };
};