export class StudentController {
    constructor(studentProfileModel, courseModel) {
        this.studentProfileModel = studentProfileModel;
        this.courseModel = courseModel;
    }

    // GET /api/courses/:courseId/students — teacher views students in their course
    getStudentsByCourse = async (req, res, next) => {
        try {
            const { courseId } = req.params;
            const course = await this.courseModel.findById(courseId);
            if (!course) return res.status(404).json({ message: 'Course not found' });
            if (req.user.role !== 'admin' && Number(course.teacher_id) !== Number(req.user.id)) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            const students = await this.studentProfileModel.findByCourse(courseId);
            res.json(students);
        } catch (err) { next(err); }
    };
}