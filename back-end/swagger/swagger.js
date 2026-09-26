import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Qallcert API',
            version: '1.0.0',
            description: 'REST API for the Qallcert Learning Management System. Supports student, teacher and admin roles.',
            contact: { name: 'Qallcert Team' },
        },
        servers: [
            { url: 'http://localhost:3000/api', description: 'Development' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Paste the access token from /auth/login',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id:    { type: 'integer', example: 1 },
                        email: { type: 'string', format: 'email', example: 'student@example.com' },
                        role:  { type: 'string', enum: ['student', 'teacher', 'admin'] },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Course: {
                    type: 'object',
                    properties: {
                        id:           { type: 'integer', example: 1 },
                        title:        { type: 'string', example: 'Introduction to Node.js' },
                        description:  { type: 'string' },
                        teacher_id:   { type: 'integer' },
                        teacher_name: { type: 'string', example: 'John Smith' },
                        created_at:   { type: 'string', format: 'date-time' },
                    },
                },
                Module: {
                    type: 'object',
                    properties: {
                        id:                 { type: 'integer' },
                        course_id:          { type: 'integer' },
                        title:              { type: 'string' },
                        order_index:        { type: 'integer' },
                        is_final:           { type: 'boolean' },
                        completion_message: { type: 'string', nullable: true },
                    },
                },
                Lesson: {
                    type: 'object',
                    properties: {
                        id:             { type: 'integer' },
                        module_id:      { type: 'integer' },
                        title:          { type: 'string' },
                        content_type:   { type: 'string', enum: ['video', 'text', 'practice'] },
                        content:        { type: 'string' },
                        available_from: { type: 'string', format: 'date-time' },
                        deadline:       { type: 'string', format: 'date-time', nullable: true },
                        author_name:    { type: 'string', nullable: true },
                    },
                },
                Assignment: {
                    type: 'object',
                    properties: {
                        id:          { type: 'integer' },
                        lesson_id:   { type: 'integer' },
                        title:       { type: 'string' },
                        description: { type: 'string', nullable: true },
                        max_score:   { type: 'number' },
                        due_date:    { type: 'string', format: 'date-time' },
                    },
                },
                Submission: {
                    type: 'object',
                    properties: {
                        id:            { type: 'integer' },
                        assignment_id: { type: 'integer' },
                        user_id:       { type: 'integer' },
                        content:       { type: 'string' },
                        submitted_at:  { type: 'string', format: 'date-time' },
                    },
                },
                Grade: {
                    type: 'object',
                    properties: {
                        id:            { type: 'integer' },
                        submission_id: { type: 'integer' },
                        score:         { type: 'number', example: 85 },
                        feedback:      { type: 'string', nullable: true },
                        graded_by:     { type: 'integer' },
                        graded_at:     { type: 'string', format: 'date-time' },
                    },
                },
                Certificate: {
                    type: 'object',
                    properties: {
                        id:                { type: 'integer' },
                        user_id:           { type: 'integer' },
                        course_id:         { type: 'integer' },
                        pdf_url:           { type: 'string', nullable: true },
                        verification_code: { type: 'string' },
                        issued_at:         { type: 'string', format: 'date-time' },
                    },
                },
                Review: {
                    type: 'object',
                    properties: {
                        id:           { type: 'integer' },
                        user_id:      { type: 'integer' },
                        course_id:    { type: 'integer' },
                        teacher_id:   { type: 'integer' },
                        rating:       { type: 'integer', minimum: 1, maximum: 5 },
                        comment:      { type: 'string', nullable: true },
                        student_name: { type: 'string', nullable: true },
                        created_at:   { type: 'string', format: 'date-time' },
                    },
                },
                Notification: {
                    type: 'object',
                    properties: {
                        id:         { type: 'integer' },
                        user_id:    { type: 'integer' },
                        type:       { type: 'string', example: 'grade_received' },
                        message:    { type: 'string' },
                        is_read:    { type: 'boolean' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error:   { type: 'string', example: 'Validation failed' },
                        details: { type: 'array', items: { type: 'string' } },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth',          description: 'Register, login, logout, token refresh' },
            { name: 'Courses',       description: 'Course CRUD and curriculum' },
            { name: 'Modules',       description: 'Module management inside courses' },
            { name: 'Lessons',       description: 'Lesson management inside modules' },
            { name: 'Assignments',   description: 'Homework assignments on lessons' },
            { name: 'Submissions',   description: 'Student assignment submissions' },
            { name: 'Grades',        description: 'Grading submissions and viewing grades' },
            { name: 'Enrollments',   description: 'Course enrollment and progress' },
            { name: 'Certificates',  description: 'Certificate generation and verification' },
            { name: 'Reviews',       description: 'Course and teacher reviews' },
            { name: 'Analytics',     description: 'Course and user analytics' },
            { name: 'Notifications', description: 'In-app notifications' },
            { name: 'Profile',       description: 'User profile management' },
        ],
    },
    // Pick up JSDoc @swagger annotations from all route and controller files
    apis: ['./routes/*.js', './controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);