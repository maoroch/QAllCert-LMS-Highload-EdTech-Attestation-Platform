export class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }

    getMyAnalytics = async (req, res, next) => {
        try {
            const stats = await this.analyticsService.getUserAnalytics(req.user.id);
            res.json(stats);
        } catch (err) {
            next(err);
        }
    };

    getCourseAnalytics = async (req, res, next) => {
        try {
            const { courseId } = req.params;
            const stats = await this.analyticsService.getCourseAnalyticsForTeacher(courseId, req.user.id, req.user.role);
            res.json(stats);
        } catch (err) {
            next(err);
        }
    };
}