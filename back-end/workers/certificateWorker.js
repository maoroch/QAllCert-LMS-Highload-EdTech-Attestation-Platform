// Пока заглушка – реальная генерация PDF будет позже
export async function processCertificate({ userId, courseId }) {
    console.log(`[Certificate] Generating for user ${userId}, course ${courseId}`);
    // TODO: вставка записи в certificates, генерация PDF, upload в S3, обновление pdf_url
    // имитация задержки
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, userId, courseId };
}