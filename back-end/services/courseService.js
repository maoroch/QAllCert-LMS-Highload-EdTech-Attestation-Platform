// services/courseService.js
export class CourseService {
    constructor(courseModel, userModel) {
        this.courseModel = courseModel;
        this.userModel = userModel;
    }

    async createCourse(data, teacherId) {
        return this.courseModel.create({ ...data, teacherId });
    }

    async getCourses(teacherId, requesterRole, search, requesterId) {
        if (requesterRole === 'teacher') {
            if (teacherId) {
                // Teacher sees only their own courses (published + draft)
                return this.courseModel.findAll({ teacherId, search, role: 'teacher' });
            } else {
                // Teacher sees all published courses + their own drafts
                return this.courseModel.findAll({ role: 'teacher', currentUserId: requesterId, search });
            }
        }
        if (requesterRole === 'admin') {
            return this.courseModel.findAll({ search });
        }
        // Students see only published courses
        return this.courseModel.findAll({ search, role: 'student' });
    }

    async checkAuthorization(course, userId, role) {
        if (role === 'admin') return true;
        if (Number(course.teacher_id) === Number(userId)) return true;
        const isCoauthor = await this.courseModel.isCoauthor(course.id, userId);
        return isCoauthor;
    }

    async publishCourse(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        const authorized = await this.checkAuthorization(course, userId, role);
        if (!authorized) throw new Error('Not authorized');
        return this.courseModel.update(courseId, { is_published: true });
    }

    async unpublishCourse(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        const authorized = await this.checkAuthorization(course, userId, role);
        if (!authorized) throw new Error('Not authorized');
        return this.courseModel.update(courseId, { is_published: false });
    }

    async getCourseById(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        
        // Add is_editable flag for frontend
        const isCoauthor = userId ? await this.courseModel.isCoauthor(courseId, userId) : false;
        course.is_editable = role === 'admin' || (userId && (Number(course.teacher_id) === Number(userId) || isCoauthor));
        
        return course;
    }

    async getCurriculum(courseId) {
        return this.courseModel.getCurriculum(courseId);
    }

    async updateCourse(courseId, updateData, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        const authorized = await this.checkAuthorization(course, userId, role);
        if (!authorized) throw new Error('Not authorized');
        return this.courseModel.update(courseId, updateData);
    }

    async deleteCourse(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        // Only the main course owner or admin can delete a course
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }
        return this.courseModel.delete(courseId);
    }

    // Co-author management
    async getCoauthors(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        // Co-authors can be viewed by admin, owner, or other co-authors
        const authorized = await this.checkAuthorization(course, userId, role);
        if (!authorized) throw new Error('Not authorized');
        return this.courseModel.findCoauthors(courseId);
    }

    async addCoauthorByEmail(courseId, email, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        
        // Only main owner or admin can add co-authors
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }

        const user = await this.userModel.findByEmail(email);
        if (!user) throw new Error('User with this email not found');
        if (user.role !== 'teacher') throw new Error('User is not a teacher');

        // Cannot add yourself as co-author
        if (Number(user.id) === Number(course.teacher_id)) {
            throw new Error('Cannot add the owner as a co-author');
        }

        return this.courseModel.addCoauthor(courseId, user.id);
    }

    async removeCoauthor(courseId, targetTeacherId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');

        // Only main owner or admin can remove co-authors
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }

        return this.courseModel.removeCoauthor(courseId, targetTeacherId);
    }
}