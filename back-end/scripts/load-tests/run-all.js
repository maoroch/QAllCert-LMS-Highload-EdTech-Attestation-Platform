// back-end/scripts/load-tests/run-all.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function executeScript(scriptName) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, scriptName);
        console.log(`\n============================================================`);
        console.log(`🚀 ЗАПУСК СКРИПТА: ${scriptName}`);
        console.log(`============================================================`);

        const child = spawn('node', [scriptPath], {
            stdio: 'inherit',
            env: process.env,
        });

        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Скрипт ${scriptName} завершился с кодом ${code}`));
        });
    });
}

async function runSuite() {
    console.log('\n🏁 ПОЛНЫЙ ЦИКЛ НАГРУЗОЧНОГО ТЕСТИРОВАНИЯ QALLCERT');
    console.log('Порядок тестов: 1. Load Test -> 2. Spike Test -> 3. Stress Test\n');

    try {
        await executeScript('1-load-test.js');
        console.log('\n⏳ Остывание системы (5 секунд)...');
        await sleep(5000);

        await executeScript('2-spike-test.js');
        console.log('\n⏳ Остывание системы (5 секунд)...');
        await sleep(5000);

        await executeScript('3-stress-test.js');

        console.log('\n============================================================');
        console.log('🎉 ВСЕ НАГРУЗОЧНЫЕ ТЕСТЫ УСПЕШНО ЗАВЕРШЕНЫ!');
        console.log('Скопируйте вывод терминала в чат для детального анализа.');
        console.log('============================================================\n');
    } catch (err) {
        console.error('\n❌ Тестирование прервано с ошибкой:', err.message);
        process.exit(1);
    }
}

runSuite();
