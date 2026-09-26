import Joi from 'joi';

// ─── Generic validator factory ────────────────────────────────────────────────
const validate = (schema, target = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
        abortEarly: false,   // collect ALL errors, not just the first
        stripUnknown: true,  // drop unknown keys — prevents mass-assignment
    });
    if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(422).json({ error: 'Validation failed', details: messages });
    }
    req[target] = value;   // replace with sanitised/coerced value
    next();
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const validateRegister = validate(
    Joi.object({
        email: Joi.string().email().max(255).required().messages({
            'string.email': 'Email must be a valid address',
            'any.required': 'Email is required',
        }),
        password: Joi.string().min(8).max(128)
            .pattern(/[A-Za-z]/, 'letter')
            .pattern(/[0-9]/, 'number')
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.pattern.name': 'Password must contain at least one {{#name}}',
                'any.required': 'Password is required',
            }),
        role: Joi.string().valid('student', 'teacher').default('student'),
        fullName: Joi.string().min(2).max(255).required().messages({
            'string.min': 'Full name must be at least 2 characters',
            'any.required': 'Full name is required',
        }),
    })
);

export const validateLogin = validate(
    Joi.object({
        email: Joi.string().email().max(255).required(),
        password: Joi.string().max(128).required(),
    })
);

export const validateRefresh = validate(
    Joi.object({
        refreshToken: Joi.string().max(512).required().messages({
            'any.required': 'refreshToken is required',
        }),
    })
);

// ─── Courses ──────────────────────────────────────────────────────────────────
export const validateCreateCourse = validate(
    Joi.object({
        title: Joi.string().min(3).max(255).required().messages({
            'string.min': 'Title must be at least 3 characters',
            'any.required': 'Title is required',
        }),
        description: Joi.string().max(5000).allow('', null).default(''),
    })
);

export const validateUpdateCourse = validate(
    Joi.object({
        title: Joi.string().min(3).max(255),
        description: Joi.string().max(5000).allow('', null),
        price: Joi.number().min(0).allow(null),
        currency: Joi.string().length(3).allow(null),
    }).min(1).messages({ 'object.min': 'At least one field must be provided' })
);

// ─── Modules ──────────────────────────────────────────────────────────────────
export const validateCreateModule = validate(
    Joi.object({
        title: Joi.string().min(2).max(255).required().messages({
            'any.required': 'Module title is required',
        }),
        isFinal: Joi.boolean().default(false),
        completionMessage: Joi.string().max(2000).allow('', null).default(null),
    })
);

export const validateUpdateModule = validate(
    Joi.object({
        title: Joi.string().min(2).max(255),
        orderIndex: Joi.number().integer().min(0),
        isFinal: Joi.boolean(),
        completionMessage: Joi.string().max(2000).allow('', null),
    }).min(1)
);

// ─── Lessons ──────────────────────────────────────────────────────────────────
const youtubeUrl = Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .pattern(/youtube\.com|youtu\.be/)
    .messages({ 'string.pattern.base': 'content must be a valid YouTube URL for video lessons' });

export const validateCreateLesson = validate(
    Joi.object({
        title: Joi.string().min(2).max(255).required(),
        // Accept both naming conventions from the frontend
        contentType: Joi.string().valid('video', 'text', 'practice').required().messages({
            'any.only': 'contentType must be video, text, or practice',
            'any.required': 'contentType is required',
        }),
        content: Joi.when('contentType', {
            is: 'video',
            then: youtubeUrl.required(),
            otherwise: Joi.string().max(100000).allow('', null).default(''),
        }),
        available_from: Joi.date().iso().required().messages({
            'any.required': 'available_from is required — when does this lesson open?',
        }),
        deadline: Joi.date().iso().greater(Joi.ref('available_from')).required().messages({
            'date.greater': 'deadline must be after available_from',
            'any.required': 'deadline is required',
        }),
    })
);

export const validateUpdateLesson = validate(
    Joi.object({
        title: Joi.string().min(2).max(255),
        contentType: Joi.string().valid('video', 'text', 'practice'),
        content_type: Joi.string().valid('video', 'text', 'practice'), // alias
        content: Joi.string().max(100000).allow('', null),
        available_from: Joi.date().iso(),
        deadline: Joi.date().iso(),
    }).min(1)
);

// ─── Assignments ──────────────────────────────────────────────────────────────
export const validateCreateAssignment = validate(
    Joi.object({
        title: Joi.string().min(2).max(255).required(),
        description: Joi.string().max(10000).allow('', null).default(''),
        max_score: Joi.number().positive().max(10000).required().messages({
            'number.positive': 'max_score must be greater than 0',
            'any.required': 'max_score is required',
        }),
        due_date: Joi.date().iso().greater('now').required().messages({
            'date.greater': 'due_date must be in the future',
            'any.required': 'due_date (deadline) is required',
        }),
    })
);

export const validateUpdateAssignment = validate(
    Joi.object({
        title: Joi.string().min(2).max(255),
        description: Joi.string().max(10000).allow('', null),
        maxScore: Joi.number().positive().max(10000),
        due_date: Joi.date().iso(),
    }).min(1)
);

// ─── Submissions ──────────────────────────────────────────────────────────────
export const validateSubmission = validate(
    Joi.object({
        content: Joi.string().min(1).max(50000).allow('', null).messages({
            'string.min': 'Submission cannot be empty',
            'string.max': 'Submission is too long (max 50 000 chars)',
        }),
        google_drive_link: Joi.string()
            .uri({ scheme: ['https'] })
            .pattern(/^https:\/\/(drive|docs)\.google\.com\//)
            .allow('', null)
            .messages({
                'string.uri': 'google_drive_link must be a valid URL',
                'string.pattern.base': 'google_drive_link must be a Google Drive or Google Docs URL',
            }),
    }).or('content', 'google_drive_link').messages({
        'object.missing': 'Provide either content or a google_drive_link',
    })
);

// ─── Grades ───────────────────────────────────────────────────────────────────
export const validateGrade = validate(
    Joi.object({
        score: Joi.number().min(0).max(10000).required().messages({
            'number.min': 'Score cannot be negative',
            'any.required': 'score is required',
        }),
        feedback: Joi.string().max(5000).allow('', null).default(''),
    })
);

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const validateReview = validate(
    Joi.object({
        teacherId: Joi.number().integer().positive().allow(null).optional(),
        courseId: Joi.number().integer().positive().allow(null).optional(),
        rating: Joi.number().integer().min(1).max(5).required().messages({
            'number.min': 'Rating must be between 1 and 5',
            'number.max': 'Rating must be between 1 and 5',
            'any.required': 'rating is required',
        }),
        comment: Joi.string().max(2000).allow('', null).default(''),
    })
);

// ─── Profile ──────────────────────────────────────────────────────────────────
export const validateUpdateProfile = validate(
    Joi.object({
        fullName: Joi.string().min(2).max(255),
        phoneNumber: Joi.string()
            .pattern(/^\+?[0-9\s\-().]{7,30}$/)
            .allow('', null)
            .messages({ 'string.pattern.base': 'phoneNumber must be a valid phone number' }),
        bio: Joi.string().max(2000).allow('', null),
        avatarUrl: Joi.string().uri().max(1000).allow('', null),
    }).min(1)
);