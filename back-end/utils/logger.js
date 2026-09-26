// utils/logger.js
// Lightweight structured logger. Replace with winston/pino in production if needed.

const levels = { info: 'INFO', warn: 'WARN', error: 'ERROR', debug: 'DEBUG' };

function log(level, message, meta = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta,
    };
    const json = JSON.stringify(entry);
    if (level === 'ERROR') {
        console.error(json);
    } else {
        console.log(json);
    }
}

export const logger = {
    info: (msg, meta) => log(levels.info, msg, meta),
    warn: (msg, meta) => log(levels.warn, msg, meta),
    error: (msg, meta) => log(levels.error, msg, meta),
    debug: (msg, meta) => log(levels.debug, msg, meta),
};
