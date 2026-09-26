export class ProctoringController {
    constructor(proctoringService) {
        this.proctoringService = proctoringService;
    }

    startSession = async (req, res, next) => {
        try {
            const { courseId } = req.body;
            if (!courseId) return res.status(400).json({ error: 'courseId is required' });
            
            const session = await this.proctoringService.startSession(req.user.id, courseId);
            res.status(201).json(session);
        } catch (err) {
            next(err);
        }
    };

    endSession = async (req, res, next) => {
        try {
            const { sessionId } = req.params;
            const session = await this.proctoringService.endSession(sessionId, req.user.id);
            res.json(session);
        } catch (err) {
            next(err);
        }
    };

    logEvent = async (req, res, next) => {
        try {
            const { sessionId } = req.params;
            const { eventType, metadata } = req.body;
            if (!eventType) return res.status(400).json({ error: 'eventType is required' });

            const event = await this.proctoringService.logEvent(sessionId, req.user.id, eventType, metadata);
            res.status(201).json(event);
        } catch (err) {
            next(err);
        }
    };

    getSessionEvents = async (req, res, next) => {
        try {
            const { sessionId } = req.params;
            const events = await this.proctoringService.getSessionEvents(sessionId, req.user.id, req.user.role);
            res.json(events);
        } catch (err) {
            next(err);
        }
    };
}
