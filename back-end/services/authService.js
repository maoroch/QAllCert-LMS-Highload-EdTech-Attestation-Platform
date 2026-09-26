import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.js';
import crypto from 'crypto';

export class AuthService {
    constructor(userModel, refreshTokenModel, studentProfileModel, teacherProfileModel, redisClient, emailService) {
        this.userModel = userModel;
        this.refreshTokenModel = refreshTokenModel;
        this.studentProfileModel = studentProfileModel;
        this.teacherProfileModel = teacherProfileModel;
        this.redis = redisClient;
        this.emailService = emailService;
    }

    async register(email, password, role, fullName, locale = 'ru') {
        const existing = await this.userModel.findByEmail(email);
        if (existing) throw new Error('User already exists');
        const hashed = await hashPassword(password);
        const user = await this.userModel.create(email, hashed, role);
        if (role === 'student') {
            await this.studentProfileModel.create(user.id, fullName);
        } else if (role === 'teacher') {
            await this.teacherProfileModel.create(user.id, fullName);
        }
        
        // Generate verification token (6-digit random number)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        await this.userModel.updateVerificationToken(user.id, verificationToken);

        // Send email (non-blocking)
        this.emailService.sendVerificationEmail(email, verificationToken, locale).catch(err => {
            // log error but don't fail registration
            console.error('[AuthService] Email verification send failed:', err.message);
        });

        return { success: true, email: user.email };
    }

    async forgotPassword(email, locale = 'ru') {
        const user = await this.userModel.findByEmail(email);
        if (!user) return true; // return true to avoid email enumeration security issues

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

        await this.userModel.updateResetToken(email, resetToken, expiresAt);
        await this.emailService.sendPasswordResetEmail(email, resetToken, locale);
        return true;
    }

    async resetPassword(token, newPassword) {
        const user = await this.userModel.findByResetToken(token);
        if (!user) throw new Error('Invalid or expired reset token');

        const hashed = await hashPassword(newPassword);
        await this.userModel.updatePassword(user.id, hashed);
        return true;
    }

    async verifyEmail(token) {
        const user = await this.userModel.findByVerificationToken(token);
        if (!user) throw new Error('Invalid verification token');

        await this.userModel.verifyEmail(token);
        return true;
    }

    async login(email, password) {
        const user = await this.userModel.findByEmail(email);
        if (!user) throw new Error('Invalid credentials');
        const valid = await comparePassword(password, user.password_hash);
        if (!valid) throw new Error('Invalid credentials');

        // if (!user.email_verified) {
        //     throw new Error('EMAIL_NOT_VERIFIED');
        // }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.refreshTokenModel.create(user.id, refreshHash, expiresAt);
        return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
    }

    async logout(refreshToken, accessToken) {
        // FIX: was using require() in ESM module — replaced with named import
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const tokenRecord = await this.refreshTokenModel.findByHash(hash);
        if (tokenRecord) {
            await this.refreshTokenModel.deleteByHash(hash);
        }
        if (this.redis && accessToken) {
            try {
                const decoded = verifyAccessToken(accessToken);
                const ttl = Math.floor(decoded.exp - Date.now() / 1000);
                if (ttl > 0) await this.redis.setEx(`blacklist:${accessToken}`, ttl, 'true');
            } catch {
                // token already expired — no need to blacklist
            }
        }
    }

    async refresh(oldRefreshToken) {
        try {
            // FIX: was using require() in ESM module — replaced with named import
            const payload = verifyRefreshToken(oldRefreshToken);
            const hash = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');
            const stored = await this.refreshTokenModel.findByHash(hash);
            if (!stored) throw new Error('Invalid refresh token');
            const user = await this.userModel.findById(payload.id);
            if (!user) throw new Error('User not found');

            // FIX: delete the OLD token BEFORE creating the new one
            // Previously deleteByUserId ran after create, wiping the new token too
            await this.refreshTokenModel.deleteByHash(hash);

            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            await this.refreshTokenModel.create(user.id, newHash, expiresAt);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (err) {
            throw new Error('Invalid refresh token');
        }
    }
}