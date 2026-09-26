export class GradeService {
    constructor(gradeModel, submissionModel, assignmentModel, statsModel, lessonModel, moduleModel, notificationService, courseModel) {
        this.gradeModel = gradeModel;
        this.submissionModel = submissionModel;
        this.assignmentModel = assignmentModel;
        this.statsModel = statsModel;
        this.lessonModel = lessonModel;
        this.moduleModel = moduleModel;
        this.notificationService = notificationService || null;
        this.courseModel = courseModel || null;
    }

    async gradeSubmission(submissionId, score, feedback, gradedById, graderRole) {
        const submission = await this.submissionModel.findById(submissionId);
        if (!submission) throw new Error('Submission not found');
        const assignment = await this.assignmentModel.findById(submission.assignment_id);
        if (!assignment) throw new Error('Assignment not found');

        // Verify the teacher is the course author
        if (graderRole !== 'admin') {
            const lesson = await this.lessonModel?.findById(assignment.lesson_id);
            const module = await this.moduleModel?.findById(lesson?.module_id);
            const course = await this.courseModel?.findById(module?.course_id);
            if (!course || Number(course.teacher_id) !== Number(gradedById)) {
                throw new Error('Not authorized: only the course author can grade submissions');
            }
        }

        if (Number(score) > Number(assignment.max_score)) {
            throw new Error(`Score ${score} exceeds max score of ${assignment.max_score}`);
        }
        const grade = await this.gradeModel.createOrUpdate({ submissionId, score, feedback, gradedById });

        try {
            await this.notificationService?.create(
                submission.user_id,
                'grade_received',
                `Your submission for "${assignment.title}" was graded — score: ${score}/${assignment.max_score}${feedback ? `. Feedback: "${feedback}"` : ''}`
            );
        } catch (err) {
            console.error('Notification failed (non-fatal):', err.message);
        }

        try {
            await this.statsModel?.updateUserStats(submission.user_id);
            const lesson = await this.lessonModel?.findById(assignment.lesson_id);
            if (lesson) {
                const module = await this.moduleModel?.findById(lesson.module_id);
                if (module) await this.statsModel?.updateCourseStats(module.course_id);
            }
        } catch (err) {
            console.error('Stats update failed (non-fatal):', err.message);
        }

        return grade;
    }

    async getGrade(submissionId) {
        return this.gradeModel.findBySubmission(submissionId);
    }

    async getCourseSubmissions(courseId) {
        return this.submissionModel.findByCourse(courseId);
    }

    // Student: get all graded assignments
    async getMyGrades(userId) {
        return this.gradeModel.findByUser(userId);
    }

    // Student: get submitted but not yet graded
    async getMyPending(userId) {
        return this.gradeModel.findPendingByUser(userId);
    }
}