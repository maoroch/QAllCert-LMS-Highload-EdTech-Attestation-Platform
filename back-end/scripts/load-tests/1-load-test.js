// back-end/scripts/load-tests/1-load-test.js
import autocannon from 'autocannon';

const targetUrl = process.env.TARGET_URL || 'http://localhost:3000';
const endpoint = process.env.TEST_ENDPOINT || '/api/courses';

console.log('====================================================');
console.log('🧪 1. LOAD TEST (Штатная нагрузка)');
console.log(`🎯 Цель: ${targetUrl}${endpoint}`);
console.log('⚙️  Параметры: 50 одновременных соединений, 25 секунд');
console.log('====================================================\n');

const instance = autocannon({
    url: `${targetUrl}${endpoint}`,
    connections: 50,
    pipelining: 1,
    duration: 25,
}, (err, result) => {
    if (err) {
        console.error('❌ Ошибка выполнения теста:', err);
        process.exit(1);
    }

    console.log('\n📊 РЕЗУЛЬТАТЫ ШТАТНОГО ТЕСТА (Load Test):');
    console.log('----------------------------------------------------');
    console.log(`✅ Всего запросов:          ${result.requests.total}`);
    console.log(`⚡ Средний RPS:             ${result.requests.average} req/sec`);
    console.log(`⏱️  Медиана задержки (p50):   ${result.latency.p50} ms`);
    const p97 = result.latency.p97_5 || result.latency.p99;
    console.log(`⏱️  97.5% пользователей (p97): ${p97} ms`);
    console.log(`⏱️  99% пользователей (p99):  ${result.latency.p99} ms`);
    console.log(`⏱️  Макс. задержка:          ${result.latency.max} ms`);
    console.log(`❌ Ошибок (4xx/5xx):        ${result.non2xx + result.errors}`);
    console.log('----------------------------------------------------');

    if (result.non2xx === 0 && p97 < 200) {
        console.log('🟢 ВЕРДИКТ: ПРЕВОСХОДНО! 0 ошибок, задержка минимальная (<200ms).\n');
    } else if (result.non2xx === 0 && p97 < 500) {
        console.log('🟡 ВЕРДИКТ: ПРИЕМЛЕМО. Задержка в норме, ошибок нет.\n');
    } else {
        console.log('🔴 ВЕРДИКТ: ВНИМАНИЕ. Есть задержки или ошибки под нагрузкой.\n');
    }
});

autocannon.track(instance, { renderProgressBar: true });
