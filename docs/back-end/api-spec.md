# 📐 API Specification — LMS Backend

Base URL: `http://localhost:3000/api`  
All requests (except `GET /health`) require `Authorization: Bearer <accessToken>` where noted.  
Default Content-Type: `application/json`

---

## 🔐 Auth

### Register
- Endpoint: `POST /auth/register`
- Auth: No

Request body (201 Created):
```json
{
    "email": "string",        // valid email
    "password": "string",     // min 6 chars
    "role": "student|teacher",
    "fullName": "string"
}
```

Response (201):
```json
{
    "user": { "id": 1, "email": "string", "role": "student|teacher" },
    "accessToken": "string",
    "refreshToken": "string"
}
```

---

### Login
- Endpoint: `POST /auth/login`
- Auth: No

Request:
```json
{ "email": "string", "password": "string" }
```

Response:
```json
{ "user": { "id": 1, "email": "string", "role": "student|teacher" }, "accessToken": "string", "refreshToken": "string" }
```

---

### Logout
- Endpoint: `POST /auth/logout`
- Auth: Required

Request:
```json
{ "refreshToken": "string" }
```

Response:
```json
{ "message": "Logged out" }
```

---

### Refresh tokens
- Endpoint: `POST /auth/refresh`
- Auth: No

Request:
```json
{ "refreshToken": "string" }
```

Response:
```json
{ "accessToken": "string", "refreshToken": "string" }
```

---

### Get current user
- Endpoint: `GET /auth/me`
- Auth: Required

Response:
```json
{ "id": 1, "email": "string", "role": "student|teacher" }
```

---

## 👤 Profile

### Get profile
- Endpoint: `GET /profile`
- Auth: Required

Response (student example):
```json
{
    "id": 1,
    "email": "string",
    "role": "student",
    "profile": {
        "full_name": "string",
        "avatar_url": null,
        "metadata": {}
    }
}
```
(Teacher includes `bio` in profile.)

---

### Update profile
- Endpoint: `PATCH /profile`
- Auth: Required

Request (partial allowed):
```json
{ "fullName?:": "string", "avatarUrl?:": "string|null", "bio?:": "string", "metadata?:": {} }
```

---

## 📚 Courses

### List courses
- Endpoint: `GET /courses`
- Auth: Required
- Query params: `?teacherId=number` (optional filter)

Response:
```json
[
    {
        "id": 1,
        "title": "string",
        "description": "string",
        "teacher_id": 1,
        "created_at": "iso8601",
        "updated_at": "iso8601"
    }
]
```

---

### Create course
- Endpoint: `POST /courses`
- Auth: Teacher only

Request:
```json
{ "title": "string", "description": "string" }
```

Response: created course object (same shape as list).

---

### Get course
- Endpoint: `GET /courses/:courseId`
- Auth: Required

Response: course object.

---

### Update course
- Endpoint: `PATCH /courses/:courseId`
- Auth: Teacher only

Request (partial):
```json
{ "title?:": "string", "description?:": "string" }
```

---

### Delete course
- Endpoint: `DELETE /courses/:courseId`
- Auth: Teacher only

Response: 204 or confirmation.

---

## 📦 Modules

### Create module
- Endpoint: `POST /courses/:courseId/modules`
- Auth: Teacher only

Request:
```json
{ "title": "string" }
```

Response:
```json
{ "id": 1, "course_id": 1, "title": "string", "order_index": 0 }
```

---

### Get modules of a course
- Endpoint: `GET /courses/:courseId/modules`
- Auth: Required

Response: array of module objects.

---

### Update module
- Endpoint: `PATCH /modules/:moduleId`
- Auth: Teacher only

Request:
```json
{ "title?:": "string", "orderIndex?:": 1 }
```

---

### Delete module
- Endpoint: `DELETE /modules/:moduleId`
- Auth: Teacher only

---

## 📝 Lessons

### Create lesson
- Endpoint: `POST /modules/:moduleId/lessons`
- Auth: Teacher only

Request:
```json
{
    "title": "string",
    "content_type": "video|text|practice",
    "content": "string" // text or URL
}
```

Response: lesson object.

---

### Get lessons of a module
- Endpoint: `GET /modules/:moduleId/lessons`
- Auth: Required

Response: array of lessons.

---

### Update lesson
- Endpoint: `PATCH /lessons/:lessonId`
- Auth: Teacher only

Request: same fields as create — all optional.

---

### Delete lesson
- Endpoint: `DELETE /lessons/:lessonId`
- Auth: Teacher only

---

## 🎓 Enrollments & Progress

### Enroll in course
- Endpoint: `POST /courses/:courseId/enroll`
- Auth: Student only

Response: enrollment object.

---

### My enrolled courses
- Endpoint: `GET /me/enrollments`
- Auth: Student only

Response:
```json
[
    {
        "id": 1,
        "course_id": 1,
        "course_title": "string",
        "status": "active|completed|dropped",
        "progress_percent": 0,
        "enrolled_at": "iso8601"
    }
]
```

---

### Complete lesson
- Endpoint: `POST /lessons/:lessonId/complete`
- Auth: Student only

Response: lesson_progress object.

---

### Get course progress
- Endpoint: `GET /courses/:courseId/progress`
- Auth: Student only

Response:
```json
{ "progressPercent": 0, "status": "string" }
```

---

## 📋 Assignments

### Create assignment
- Endpoint: `POST /lessons/:lessonId/assignments`
- Auth: Teacher only

Request:
```json
{ "title": "string", "description?:": "string", "max_score": 100 }
```

Response: assignment object.

---

### Get assignments of a lesson
- Endpoint: `GET /lessons/:lessonId/assignments`
- Auth: Required

Response: array of assignments.

---

### Update assignment
- Endpoint: `PATCH /assignments/:assignmentId`
- Auth: Teacher only

Request: same as create — all optional.

---

### Delete assignment
- Endpoint: `DELETE /assignments/:assignmentId`
- Auth: Teacher only

---

## 📎 Submissions

### Submit answer
- Endpoint: `POST /assignments/:assignmentId/submit`
- Auth: Student only

Request:
```json
{ "content": "string" }
```

Response: submission object.

---

### Get my submission
- Endpoint: `GET /assignments/:assignmentId/my-submission`
- Auth: Student only

Response: submission or 404.

---

### List all submissions (teacher)
- Endpoint: `GET /assignments/:assignmentId/submissions`
- Auth: Teacher only

Response:
```json
[
    {
        "id": 1,
        "user_id": 1,
        "content": "string",
        "submitted_at": "iso8601",
        "email?": "string"
    }
]
```

---

## 🎯 Grades

### Grade submission
- Endpoint: `POST /submissions/:submissionId/grade`
- Auth: Teacher only

Request:
```json
{ "score": 95, "feedback?:": "string" }
```

Response: grade object.

---

### Get grade
- Endpoint: `GET /submissions/:submissionId/grade`
- Auth: Student (own) or Teacher (any)

Response:
```json
{ "score": 95, "feedback": "string", "graded_by": 1, "graded_at": "iso8601" }
```
or 404.

---

## 🏆 Certificates

### Generate certificate
- Endpoint: `POST /courses/:courseId/certificate`
- Auth: Student only

Response (queued):
```json
{ "message": "queued", "jobId": "string" }
```
If already exists: returns certificate object.

---

### My certificates
- Endpoint: `GET /me/certificates`
- Auth: Student only

Response:
```json
[
    {
        "id": 1,
        "course_id": 1,
        "course_title": "string",
        "issued_at": "iso8601",
        "pdf_url": "string",
        "verification_code": "string"
    }
]
```

---

### Verify certificate (public)
- Endpoint: `GET /certificates/verify/:code`
- Auth: No

Response: certificate object or 404.

---

## 📊 Analytics

### My analytics
- Endpoint: `GET /analytics/me`
- Auth: Student only

Response:
```json
{ "total_courses": 10, "completed_courses": 2, "average_score": 87.5 }
```

---

### Course analytics
- Endpoint: `GET /analytics/courses/:courseId`
- Auth: Teacher only

Response:
```json
{
    "stats": {
        "completion_rate": 0.75,
        "average_score": 85.2,
        "active_students_count": 120,
        "updated_at": "iso8601"
    },
    "students": [ /* enrollment details */ ]
}
```

---

## 👁️ Proctoring (ML Monitoring)

### Start session
- Endpoint: `POST /proctoring/sessions`
- Auth: Required

Request:
```json
{ "courseId": 1 }
```

Response:
```json
{ "id": 1, "user_id": 1, "course_id": 1, "status": "active", "started_at": "iso8601" }
```

---

### End session
- Endpoint: `POST /proctoring/sessions/:sessionId/end`
- Auth: Required

Response: session object with `status` = `"ended"` or `"flagged"`.

---

### Log event
- Endpoint: `POST /proctoring/sessions/:sessionId/events`
- Auth: Required

Request:
```json
{ "eventType": "face_detected|no_face|multiple_faces|tab_switch|suspicious_behavior", "metadata?": {} }
```

Response: event object.

---

### Get session events
- Endpoint: `GET /proctoring/sessions/:sessionId/events`
- Auth: Student (own) or Teacher

Response: array of events.

---

## ❤️ Health

### Health check
- Endpoint: `GET /health`
- Auth: No

Response:
```json
{ "status": "ok", "timestamp": "iso8601" }
```

---

## 🧪 Error format & status codes

Error response:
```json
{ "error": "string", "message?": "string" }
```

Common HTTP status codes used: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `500`.

