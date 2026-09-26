// back-end/scripts/load-tests/2-spike-test.js
import autocannon from 'autocannon';

const targetUrl = process.env.TARGET_URL || 'http://localhost:3000';
const endpoint = process.env.TEST_ENDPOINT || '/api/courses';

console.log('====================================================');
console.log('⚡ 2. SPIKE TEST (Всплеск нагрузки / Наплыв пользователей)');
console.log(`🎯 Цель: ${targetUrl}${endpoint}`);
console.log('⚙️  Параметры: 250 одновременных соединений, 15 секунд');
console.log('   (Имитирует одновременный заход учителей после анонса результатов)');
console.log('====================================================\n');

const instance = autocannon({
    url: `${targetUrl}${endpoint}`,
    connections: 250,
    pipelining: 1,
    duration: 15,
}, (err, result) => {
    if (err) {
        console.error('❌ Ошибка выполнения теста:', err);
        process.exit(1);
    }

    console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТА НА ВСПЛЕСК (Spike Test):');
    console.log('----------------------------------------------------');
    console.log(`✅ Всего запросов:          ${result.requests.total}`);
    console.log(`⚡ Пиковый RPS:             ${result.requests.average} req/sec`);
    console.log(`⏱️  Медиана задержки (p50):   ${result.latency.p50} ms`);
    const p97 = result.latency.p97_5 || result.latency.p99;
    console.log(`⏱️  97.5% пользователей (p97): ${p97} ms`);
    console.log(`⏱️  99% пользователей (p99):  ${result.latency.p99} ms`);
    console.log(`⏱️  Макс. задержка:          ${result.latency.max} ms`);
    console.log(`❌ Ошибок (timeouts/5xx):   ${result.non2xx + result.errors}`);
    console.log('----------------------------------------------------');

    const totalErrors = result.non2xx + result.errors;
    if (totalErrors === 0 && p97 < 600) {
        console.log('🟢 ВЕРДИКТ: ОТЛИЧНО! Сервер выдержал резкий всплеск (250 соединений) без единой ошибки.\n');
    } else if (totalErrors === 0 && p97 < 1500) {
        console.log('🟡 ВЕРДИКТ: УДОВЛЕТВОРИТЕЛЬНО. Ошибок нет, но задержка временно возросла.\n');
    } else {
        console.log(`🔴 ВЕРДИКТ: ОБНАРУЖЕНЫ СБОИ. Ошибок: ${totalErrors}.\n`);
    }
});

autocannon.track(instance, { renderProgressBar: true });
