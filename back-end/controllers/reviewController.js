export class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }

    create = async (req, res, next) => {
        try {
            const courseId = req.params.courseId || req.body.courseId;
            const teacherId = req.params.teacherId || req.body.teacherId;
            const { rating, comment } = req.body;
            const review = await this.reviewService.createReview(
                req.user.id, courseId, teacherId, rating, comment
            );
            res.status(201).json(review);
        } catch (err) { next(err); }
    };

    getByCourse = async (req, res, next) => {
        try {
            const reviews = await this.reviewService.getCourseReviews(req.params.courseId);
            res.json(reviews);
        } catch (err) { next(err); }
    };

    getByTeacher = async (req, res, next) => {
        try {
            const reviews = await this.reviewService.getTeacherReviews(req.params.teacherId);
            res.json(reviews);
        } catch (err) { next(err); }
    };

    delete = async (req, res, next) => {
        try {
            await this.reviewService.deleteReview(req.params.reviewId, req.user.id);
            res.json({ message: 'Review deleted' });
        } catch (err) { next(err); }
    };
}