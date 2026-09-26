import rateLimit from 'express-rate-limit';

// ── Key generator helpers ──────────────────────────────────────────────────────
// Separate counters per user (if authenticated) or per IP (for public routes)
const keyByUser = (req) =>
    req.user ? `user:${req.user.id}` : `ip:${req.ip}`;

const keyByUserAndRole = (req) =>
    req.user ? `${req.user.role}:${req.user.id}` : `ip:${req.ip}`;

// ── Message factory ────────────────────────────────────────────────────────────
const msg = (text) => ({ error: text });

// ── Skip helper for testing/benchmarking ───────────────────────────────────────
const shouldSkip = () => process.env.DISABLE_RATE_LIMIT === 'true' || process.env.NODE_ENV === 'test';

// ── 1. Global IP-level guard (DDoS / scraping protection) ─────────────────────
// Very generous — only blocks true flood attacks.
// Applied globally in app.js before auth middleware.
export const limiter = rateLimit({
    windowMs: 60 * 1000,        // 1 min
    max: 300,                   // 300 req/min per IP — ~5 req/s
    standardHeaders: true,
    legacyHeaders: false,
    skip: shouldSkip,
    message: msg('Too many requests from this IP. Please slow down.'),
});

// ── 2. Auth limiter (login / register / refresh) ───────────────────────────────
// Low limit to prevent brute-force; only failed requests count.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 min
    max: 15,                    // 15 attempts per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    skip: shouldSkip,
    message: msg('Too many auth attempts. Please wait 15 minutes and try again.'),
});

// ── 3. Student read limiter (lessons, curriculum, progress, files) ─────────────
// Students actively browse content — give them room to navigate without hitting limits.
export const studentReadLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 min
    max: 120,                   // 120 req/min per user — ~2 req/s
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    skip: shouldSkip,
    message: msg('You\'re browsing too fast. Please slow down.'),
});

// ── 4. Student write limiter (submit assignment, mark lesson complete, enroll) ──
// Writing is less frequent; tighter limits prevent spam/abuse.
export const studentWriteLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 min
    max: 30,                    // 30 write actions/min
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    message: msg('Too many actions in a short period. Please wait a moment.'),
});

// ── 5. Teacher content management limiter (create/edit/delete course, module, lesson) ─
// Teachers make structural changes less frequently; moderate limit is fine.
export const teacherWriteLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 min
    max: 60,                    // 60 write actions/min — enough for bulk edits
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    message: msg('Too many content edits. Please slow down.'),
});

// ── 6. Grading limiter (teacher grades submissions) ────────────────────────────
// Grading is high-frequency during exam periods — give teachers room to work.
export const gradingLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 min
    max: 120,                   // 120 grades/min — fast batch grading supported
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    message: msg('Grading too fast. Please take a short break.'),
});

// ── 7. File upload limiter (cover images, lesson materials, submissions) ────────
// Uploads are expensive; strict limit to protect storage bandwidth.
export const uploadLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 min
    max: 10,                    // 10 uploads/min per user
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    message: msg('Too many file uploads. Please wait before uploading more.'),
});

// ── 8. Submission limiter (per-assignment spam guard) ─────────────────────────
// Separate from general student write limiter — specific anti-spam for submissions.
export const submissionLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,   // 5 min
    max: 10,                    // 10 submissions per 5 min
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    message: msg('Submitting too fast. Please wait a few minutes.'),
});

// ── 9. Certificate / heavy-operation limiter (PDF gen, ML, analytics exports) ──
// These are CPU/memory intensive — hard cap per user per hour.
export const heavyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 20,                    // 20 heavy ops/hour per user
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    message: msg('Rate limit exceeded for this operation. Please try again in an hour.'),
});

// ── 10. Review limiter (prevent review spam) ───────────────────────────────────
export const reviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 10,                    // 10 reviews per hour per user
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    message: msg('You\'ve submitted too many reviews. Please wait before leaving another.'),
});

// ── 11. Order / payment limiter (prevent accidental double orders) ─────────────
export const orderLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 min
    max: 5,                     // 5 order attempts/min per user
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    message: msg('Too many order requests. Please wait before trying again.'),
});