export class ProctoringService {
    constructor(proctoringModel) {
        this.proctoringModel = proctoringModel;
    }

    async startSession(userId, courseId) {
        return await this.proctoringModel.startSession(userId, courseId);
    }

    async endSession(sessionId, userId) {
        const session = await this.proctoringModel.getSession(sessionId);
        if (!session) throw new Error('Session not found');
        if (session.user_id !== userId) throw new Error('Unauthorized to end this session');

        return await this.proctoringModel.endSession(sessionId, 'ended');
    }

    async logEvent(sessionId, userId, eventType, metadata) {
        const session = await this.proctoringModel.getSession(sessionId);
        if (!session) throw new Error('Session not found');
        if (session.user_id !== userId) throw new Error('Unauthorized');
        if (session.status !== 'active') throw new Error('Session is not active');

        const event = await this.proctoringModel.logEvent(sessionId, eventType, metadata);
        
        // Auto flag session if suspicious behavior detected
        if (eventType === 'suspicious_behavior' || eventType === 'multiple_faces') {
            await this.proctoringModel.endSession(sessionId, 'flagged');
        }

        return event;
    }

    async getSessionEvents(sessionId, userId, userRole) {
        const session = await this.proctoringModel.getSession(sessionId);
        if (!session) throw new Error('Session not found');
        // Only the student or a teacher can view events
        if (session.user_id !== userId && userRole !== 'teacher') {
            throw new Error('Unauthorized to view these events');
        }

        return await this.proctoringModel.getSessionEvents(sessionId);
    }
}
