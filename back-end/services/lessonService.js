import { sanitizeContent } from '../utils/sanitize.js';

export class LessonService {
    constructor(lessonModel, moduleModel, courseModel) {
        this.lessonModel = lessonModel;
        this.moduleModel = moduleModel;
        this.courseModel = courseModel;
    }

    async createLesson(moduleId, data, currentUserId, userRole) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) throw new Error('Module not found');
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        // available_from and deadline are REQUIRED
        if (!data.available_from) throw new Error('available_from is required');
        if (!data.deadline) throw new Error('deadline is required');
        const maxOrder = await this.lessonModel.getMaxOrderIndex(moduleId);
        return this.lessonModel.create({
            ...data,
            content: sanitizeContent(data.content),
            contentType: data.content_type || data.contentType,
            moduleId,
            orderIndex: maxOrder + 1,
        });
    }

    async getLessonsByModule(moduleId) {
        return this.lessonModel.findByModule(moduleId);
    }

    async getLessonById(lessonId) {
        const lesson = await this.lessonModel.findByIdWithAuthor(lessonId);
        if (!lesson) throw new Error('Lesson not found');
        return lesson;
    }

    async updateLesson(lessonId, data, currentUserId, userRole, reqUserId) {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) throw new Error('Lesson not found');
        const module = await this.moduleModel.findById(lesson.module_id);
        const course = await this.courseModel.findById(module.course_id);
        const reqUser = await this.userModel.findById(reqUserId);
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        return this.lessonModel.update(lessonId, {
            ...data,
            content: sanitizeContent(data.content),
            contentType: data.content_type || data.contentType,
        });
    }

    async deleteLesson(lessonId, currentUserId, userRole) {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) throw new Error('Lesson not found');
        const module = await this.moduleModel.findById(lesson.module_id);
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        return this.lessonModel.delete(lessonId);
    }
}