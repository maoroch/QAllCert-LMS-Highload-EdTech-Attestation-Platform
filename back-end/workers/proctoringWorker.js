export async function processProctoring({ sessionId, imageBuffer }) {
    console.log(`[Proctoring] Analyzing frame for session ${sessionId}`);
    // Здесь вызов ML-модели, запись события в БД через отдельный сервис
    return { analyzed: true };
}