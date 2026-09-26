/**
 * @swagger
 * /courses:
 *   get:
 *     tags: [Courses]
 *     summary: Get all courses (cached 60s)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by title or description
 *     responses:
 *       200:
 *         description: Array of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Course' }
 *   post:
 *     tags: [Courses]
 *     summary: Create a course (teacher only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:       { type: string, minLength: 3, maxLength: 255 }
 *               description: { type: string, maxLength: 5000 }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Course' }
 *       403: { description: Teacher role required }
 *
 * /courses/{courseId}:
 *   get:
 *     tags: [Courses]
 *     summary: Get a single course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Course' }
 *       404: { description: Course not found }
 *   patch:
 *     tags: [Courses]
 *     summary: Update a course (owner teacher only)
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:       { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Course' }
 *       403: { description: Not the course owner }
 *   delete:
 *     tags: [Courses]
 *     summary: Delete a course and all its content
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *
 * /courses/{courseId}/curriculum:
 *   get:
 *     tags: [Courses]
 *     summary: Get full course curriculum (modules + lessons)
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Curriculum tree
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   module_id:          { type: integer }
 *                   module_title:       { type: string }
 *                   is_final:           { type: boolean }
 *                   completion_message: { type: string }
 *                   lessons:
 *                     type: array
 *                     items: { $ref: '#/components/schemas/Lesson' }
 *
 * /courses/{courseId}/modules:
 *   post:
 *     tags: [Modules]
 *     summary: Add a module to a course (teacher only)
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:             { type: string }
 *               isFinal:           { type: boolean, default: false }
 *               completionMessage: { type: string }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Module' }
 *
 * /modules/{moduleId}/lessons:
 *   post:
 *     tags: [Lessons]
 *     summary: Add a lesson to a module (teacher only)
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, contentType, available_from, deadline]
 *             properties:
 *               title:          { type: string }
 *               contentType:    { type: string, enum: [video, text, practice] }
 *               content:        { type: string }
 *               available_from: { type: string, format: date-time }
 *               deadline:       { type: string, format: date-time }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lesson' }
 *
 * /lessons/{lessonId}:
 *   get:
 *     tags: [Lessons]
 *     summary: Get a single lesson with author info
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lesson' }
 *       403: { description: Lesson not yet available }
 *       404: { description: Not found }
 *   patch:
 *     tags: [Lessons]
 *     summary: Update a lesson (teacher only)
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:          { type: string }
 *               contentType:    { type: string }
 *               content:        { type: string }
 *               available_from: { type: string, format: date-time }
 *               deadline:       { type: string, format: date-time }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lesson' }
 *   delete:
 *     tags: [Lessons]
 *     summary: Delete a lesson
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *
 * /lessons/{lessonId}/complete:
 *   post:
 *     tags: [Enrollments]
 *     summary: Mark a lesson as completed (student only)
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Progress updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progressPercent: { type: integer }
 *
 * /lessons/{lessonId}/assignments:
 *   post:
 *     tags: [Assignments]
 *     summary: Create assignment on a lesson (teacher only)
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, max_score, due_date]
 *             properties:
 *               title:       { type: string }
 *               description: { type: string }
 *               max_score:   { type: number }
 *               due_date:    { type: string, format: date-time }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Assignment' }
 *   get:
 *     tags: [Assignments]
 *     summary: Get all assignments for a lesson
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Assignment' }
 *
 * /assignments/{assignmentId}/submit:
 *   post:
 *     tags: [Submissions]
 *     summary: Submit an assignment answer (student only)
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, maxLength: 50000 }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Submission' }
 *
 * /submissions/{submissionId}/grade:
 *   post:
 *     tags: [Grades]
 *     summary: Grade a submission (teacher only)
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score]
 *             properties:
 *               score:    { type: number, minimum: 0 }
 *               feedback: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Grade' }
 *   get:
 *     tags: [Grades]
 *     summary: Get grade for a submission
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Grade' }
 *
 * /me/grades:
 *   get:
 *     tags: [Grades]
 *     summary: Get all graded assignments for current student
 *     responses:
 *       200:
 *         description: Array of graded items with full context
 *
 * /me/grades/pending:
 *   get:
 *     tags: [Grades]
 *     summary: Get ungraded submissions for current student
 *     responses:
 *       200:
 *         description: Array of pending submissions
 *
 * /courses/{courseId}/enroll:
 *   post:
 *     tags: [Enrollments]
 *     summary: Enroll in a course (student only)
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201: { description: Enrolled successfully }
 *       409: { description: Already enrolled }
 *
 * /courses/{courseId}/progress:
 *   get:
 *     tags: [Enrollments]
 *     summary: Get progress for current student in a course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progressPercent:  { type: integer }
 *                 status:           { type: string }
 *                 completedLessons: { type: array, items: { type: integer } }
 *
 * /courses/{courseId}/certificate:
 *   post:
 *     tags: [Certificates]
 *     summary: Generate certificate for completed course (student only)
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Certificate' }
 *       400: { description: Course not completed }
 *
 * /me/certificates:
 *   get:
 *     tags: [Certificates]
 *     summary: Get all certificates for current user
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Certificate' }
 *
 * /certificates/verify/{code}:
 *   get:
 *     tags: [Certificates]
 *     summary: Publicly verify a certificate by code
 *     security: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Certificate' }
 *       404: { description: Certificate not found }
 *
 * /courses/{courseId}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Leave a review for a course (enrolled student only)
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [teacherId, rating]
 *             properties:
 *               teacherId: { type: integer }
 *               rating:    { type: integer, minimum: 1, maximum: 5 }
 *               comment:   { type: string, maxLength: 2000 }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Review' }
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews for a course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Review' }
 *
 * /teachers/{teacherId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews for a teacher
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Review' }
 *
 * /analytics/me:
 *   get:
 *     tags: [Analytics]
 *     summary: Get stats for current user
 *     responses:
 *       200:
 *         description: User analytics
 *
 * /analytics/courses/{courseId}:
 *   get:
 *     tags: [Analytics]
 *     summary: Get analytics for a course (teacher only)
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Course analytics with student list
 *
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get notifications for current user
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Notification' }
 *
 * /notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     responses:
 *       200: { description: All marked as read }
 *
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a single notification as read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Marked as read }
 */