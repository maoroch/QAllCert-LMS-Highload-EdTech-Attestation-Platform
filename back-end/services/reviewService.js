export class ReviewService {
    constructor(reviewModel, enrollmentModel) {
        this.reviewModel = reviewModel;
        this.enrollmentModel = enrollmentModel;
    }

    async createReview(userId, courseId, teacherId, rating, comment) {
        // Student can only review courses they are enrolled in
        const enrollment = await this.enrollmentModel.findOne(userId, courseId);
        if (!enrollment) throw new Error('You must be enrolled in this course to leave a review');
        return this.reviewModel.create({ userId, courseId, teacherId, rating, comment });
    }

    async getCourseReviews(courseId) {
        return this.reviewModel.findByCourse(courseId);
    }

    async getTeacherReviews(teacherId) {
        return this.reviewModel.findByTeacher(teacherId);
    }

    async deleteReview(reviewId, userId) {
        return this.reviewModel.delete(reviewId, userId);
    }
}