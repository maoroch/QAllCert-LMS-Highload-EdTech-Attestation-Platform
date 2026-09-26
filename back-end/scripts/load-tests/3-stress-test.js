// back-end/scripts/load-tests/3-stress-test.js
import autocannon from 'autocannon';

const targetUrl = process.env.TARGET_URL || 'http://localhost:3000';
const endpoint = process.env.TEST_ENDPOINT || '/api/courses';

console.log('====================================================');
console.log('🔥 3. STRESS TEST (Поиск точки отказа / Breakpoint)');
console.log(`🎯 Цель: ${targetUrl}${endpoint}`);
console.log('⚙️  Ступени нагрузки: 50 -> 150 -> 300 -> 500 соединений');
console.log('====================================================\n');

function runStage(connections, durationSeconds) {
    return new Promise((resolve, reject) => {
        console.log(`\n▶️  [СТУПЕНЬ] Нагрузка: ${connections} параллельных соединений (${durationSeconds} сек)...`);
        
        const instance = autocannon({
            url: `${targetUrl}${endpoint}`,
            connections,
            pipelining: 1,
            duration: durationSeconds,
        }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });

        autocannon.track(instance, { renderProgressBar: true });
    });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    const stages = [
        { connections: 50,  duration: 10, label: 'Этап 1 (50 conn - Базовый)' },
        { connections: 150, duration: 10, label: 'Этап 2 (150 conn - Умеренный стресс)' },
        { connections: 300, duration: 10, label: 'Этап 3 (300 conn - Высокий стресс)' },
        { connections: 500, duration: 10, label: 'Этап 4 (500 conn - Предельный стресс)' },
    ];

    const summary = [];

    for (const stage of stages) {
        try {
            const res = await runStage(stage.connections, stage.duration);
            summary.push({
                stage: stage.label,
                connections: stage.connections,
                rps: Math.round(res.requests.average),
                p50: res.latency.p50,
                p97: res.latency.p97_5,
                p99: res.latency.p99,
                errors: res.non2xx + res.errors,
            });
            // Небольшая пауза между ступенями для очистки соединений
            await sleep(2000);
        } catch (err) {
            console.error(`❌ Ошибка на этапе ${stage.label}:`, err.message);
            summary.push({
                stage: stage.label,
                connections: stage.connections,
                rps: 0,
                p50: 'ERR',
                p95: 'ERR',
                p99: 'ERR',
                errors: 'CRASH',
            });
            break;
        }
    }

    console.log('\n\n====================================================');
    console.log('📈 СВОДНАЯ ТАБЛИЦА СТРЕСС-ТЕСТИРОВАНИЯ (Stress Test Summary)');
    console.log('====================================================');
    console.table(summary);

    // Анализ точки насыщения
    const failedStage = summary.find(s => s.errors > 0);
    if (!failedStage) {
        console.log('🏆 ВЕРДИКТ: Сервер успешно прошел ВСЕ ступени вплоть до 500 соединений без ошибок!\n');
    } else {
        console.log(`⚠️ ВЕРДИКТ: Точка насыщения/сбоя достигнута на: "${failedStage.stage}". Ошибок: ${failedStage.errors}.\n`);
    }
}

main().catch(console.error);
