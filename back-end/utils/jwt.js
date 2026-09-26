import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};
export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
};
export const verifyAccessToken = (token) => jwt.verify(token, config.jwtSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, config.jwtRefreshSecret);