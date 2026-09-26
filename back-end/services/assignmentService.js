export class AssignmentService {
    constructor(assignmentModel, lessonModel, moduleModel, courseModel) {
        this.assignmentModel = assignmentModel;
        this.lessonModel = lessonModel;
        this.moduleModel = moduleModel;
        this.courseModel = courseModel;
    }

    async createAssignment(lessonId, data, currentUserId, userRole) {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) throw new Error('Lesson not found');
        const module = await this.moduleModel.findById(lesson.module_id);
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        return this.assignmentModel.create({ ...data, lessonId });
    }

    async getAssignmentsByLesson(lessonId) {
        return this.assignmentModel.findByLesson(lessonId);
    }

    async updateAssignment(assignmentId, data, currentUserId, userRole) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) throw new Error('Assignment not found');
        const lesson = await this.lessonModel.findById(assignment.lesson_id);
        const module = await this.moduleModel.findById(lesson.module_id);
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        return this.assignmentModel.update(assignmentId, data);
    }

    async deleteAssignment(assignmentId, currentUserId, userRole) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) throw new Error('Assignment not found');
        const lesson = await this.lessonModel.findById(assignment.lesson_id);
        const module = await this.moduleModel.findById(lesson.module_id);
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        return this.assignmentModel.delete(assignmentId);
    }
}