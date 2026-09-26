export class SubmissionService {
    constructor(submissionModel, assignmentModel, lessonModel, moduleModel, courseModel) {
        this.submissionModel = submissionModel;
        this.assignmentModel = assignmentModel;
        this.lessonModel     = lessonModel;
        this.moduleModel     = moduleModel;
        this.courseModel     = courseModel;
    }

    async submitAssignment(assignmentId, userId, content, googleDriveLink) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) throw new Error('Assignment not found');

        // Require either text content or a Google Drive link
        if (!content && !googleDriveLink) {
            throw new Error('Either content or a Google Drive link is required');
        }

        // Validate Google Drive URL format if provided
        if (googleDriveLink) {
            const isValidDriveUrl =
                /^https:\/\/(drive|docs)\.google\.com\/.+/.test(googleDriveLink);
            if (!isValidDriveUrl) {
                throw new Error('google_drive_link must be a valid Google Drive or Google Docs URL');
            }
        }

        return this.submissionModel.create({ assignmentId, userId, content, googleDriveLink });
    }

    async getMySubmission(assignmentId, userId) {
        return this.submissionModel.findByAssignmentAndUser(assignmentId, userId);
    }

    async getAllSubmissionsForTeacher(assignmentId, currentUserId, userRole) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) throw new Error('Assignment not found');
        const lesson  = await this.lessonModel.findById(assignment.lesson_id);
        const module  = await this.moduleModel.findById(lesson.module_id);
        const course  = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && course.teacher_id !== currentUserId) {
            throw new Error('Not authorized');
        }
        return this.submissionModel.findByAssignment(assignmentId);
    }
}
