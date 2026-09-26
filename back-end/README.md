# 📚 LMS Backend — Express.js

Online Learning Platform backend using PostgreSQL, Redis and BullMQ.

## 🚀 Tech stack
- Node.js (v22+) · Express.js  
- PostgreSQL — primary DB  
- Redis — cache, rate limiting, queues  
- BullMQ — background jobs  
- JWT (access + refresh) · bcrypt for passwords

## 📁 Project structure (simplified)
```
.
├── config/         # env loading
├── controllers/    # route handlers
├── services/       # business logic
├── models/         # SQL queries
├── routes/         # Express routers
├── middlewares/    # auth, role, caching, rate limit
├── lib/            # redis, bullmq queues
├── workers/        # background processors
├── utils/          # JWT, hash, PDF generator
├── app.js          # main app
└── .env            # environment variables
```

## 🔧 Prerequisites
- Node.js v22+  
- PostgreSQL v14+  
- Redis v6+

## ⚙️ Installation
```bash
git clone <repo>
cd back-end
npm install
```

## 🔐 Environment (.env)
Create a .env file:
```
PORT=3000
POSTGRES_URI=postgresql://localhost/lms_edu
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=another_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## 🗄️ Database
```bash
createdb lms_edu
psql -d lms_edu -f schema.sql  # use project schema.sql
```

## ▶️ Run
```bash
npm start      # production
npm run dev    # development (nodemon)
```

Health check:
```
curl http://localhost:3000/health
```

## 🧭 API overview
All endpoints are prefixed with `/api`.

- Auth
    - POST /api/auth/register
    - POST /api/auth/login
    - POST /api/auth/logout
    - POST /api/auth/refresh
    - GET  /api/auth/me

- Courses (teacher required for write)
    - GET    /api/courses
    - POST   /api/courses
    - GET    /api/courses/:id
    - PATCH  /api/courses/:id
    - DELETE /api/courses/:id
    - POST   /api/courses/:id/modules
    - …modules/lessons endpoints

- Enrollments & progress
    - POST /api/courses/:id/enroll
    - POST /api/lessons/:id/complete
    - GET  /api/courses/:id/progress

- Assignments & grades
    - POST /api/lessons/:id/assignments
    - POST /api/assignments/:id/submit
    - POST /api/submissions/:id/grade

- Certificates
    - POST /api/courses/:id/certificate
    - GET  /api/me/certificates
    - GET  /api/certificates/verify/:code

- Analytics
    - GET /api/analytics/me
    - GET /api/analytics/courses/:id  (teacher)

Full API details: api-spec.md

## 🧪 Examples (cURL)
Register student:
```bash
curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"s@t.com","password":"123","role":"student","fullName":"John"}'
```

Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"s@t.com","password":"123"}'
```

Create course (teacher):
```bash
curl -X POST http://localhost:3000/api/courses \
    -H "Authorization: Bearer <teacher_token>" \
    -H "Content-Type: application/json" \
    -d '{"title":"Node.js","description":"..."}'
```

## ♻️ Background jobs (BullMQ)
- certificate-queue — certificate generation  
- analytics-queue — analytics refresh  
- proctoring-queue — proctoring analysis  
Workers run in-process by default (can be split to separate services).

## 👥 Roles
- student — enroll, complete lessons, submit assignments, view own grades & certificates.  
- teacher — create/edit courses/modules/lessons, grade assignments, view course analytics.

## 🔒 Security
- Passwords hashed with bcrypt  
- Short-lived access tokens + refresh tokens stored in DB  
- Redis blacklist on logout  
- Helmet, CORS and rate limiting configured

## 🚧 Known limitations
See status.md for current issues and roadmap ideas.

## 📄 License
MIT
