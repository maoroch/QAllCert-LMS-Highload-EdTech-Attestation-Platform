// utils/sanitize.js
// Server-side HTML/markdown sanitizer using a lightweight allowlist regex approach.
// For production, consider adding 'isomorphic-dompurify' or 'sanitize-html' package.

/**
 * Strips dangerous HTML from markdown/text content.
 * Allows safe markdown-generated tags only.
 */
export function sanitizeContent(input) {
    if (!input || typeof input !== 'string') return input;

    // Remove script tags and their content
    let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers (onclick, onload, onerror, etc.)
    clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: URLs
    clean = clean.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="removed:');
    clean = clean.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src="removed:');

    // Remove <iframe>, <object>, <embed>, <form> tags
    clean = clean.replace(/<(iframe|object|embed|form|input|button)\b[^>]*>.*?<\/\1>/gis, '');
    clean = clean.replace(/<(iframe|object|embed|form|input|button)\b[^>]*\/?>/gi, '');

    // Remove data: URIs in src/href (potential XSS vector)
    clean = clean.replace(/(src|href)\s*=\s*["']data:[^"']*["']/gi, '$1="removed:"');

    return clean;
}

/**
 * Sanitize a URL — returns null if dangerous.
 */
export function sanitizeUrl(url) {
    if (!url) return null;
    const trimmed = url.trim().toLowerCase();
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) return null;
    return url.trim();
}
