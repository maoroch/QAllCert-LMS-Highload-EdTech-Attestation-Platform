import { createClient } from 'redis';

let client;

export async function initRedis(app, options = {}) {
    if (client && client.isOpen) return client;
    const url = options.url || process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    client = createClient({ url });
    client.on('error', (err) => console.error('Redis Client Error', err));
    try {
        await client.connect();
        console.log(`✅ Connected to Redis: ${url}`);
    } catch (err) {
        console.error('❌ Failed to connect to Redis:', err);
    }
    if (app && typeof app.use === 'function') {
        app.set('redis', client);
        app.use((req, res, next) => {
            req.redis = client;
            next();
        });
    }
    return client;
}

export function getClient() {
    if (!client || !client.isOpen) throw new Error('Redis not connected');
    return client;
}

export function getBullConnection() {
    const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    const { hostname, port, password } = new URL(url);
    return {
        host: hostname,
        port: parseInt(port, 10),
        password: password || undefined,
    };
}