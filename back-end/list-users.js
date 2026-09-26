import pg from 'pg';
import dotenv from 'dotenv';
import config from './config/index.js';

dotenv.config();

const pool = new pg.Pool({ connectionString: config.postgresUri });

async function listUsers() {
    try {
        console.log('🔍 Fetching users from the database...');
        await pool.connect();

        const result = await pool.query('SELECT id, email, role, created_at FROM users ORDER BY id ASC');
        if (result.rows.length === 0) {
            console.log('⚠️ No users found in the database.');
        } else {
            console.table(result.rows);
        }
    } catch (err) {
        console.error('❌ Failed to list users:', err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

listUsers();
