import pg from 'pg';
import dotenv from 'dotenv';
import config from './config/index.js';

dotenv.config();

async function clearCourses() {
    const pool = new pg.Pool({ connectionString: config.postgresUri });
    try {
        console.log('🧹 Clearing all course-related data from DB...');
        await pool.query('DELETE FROM course_coauthors');
        await pool.query('DELETE FROM enrollments');
        await pool.query('DELETE FROM certificates');
        await pool.query('DELETE FROM reviews');
        await pool.query('DELETE FROM orders');
        await pool.query('DELETE FROM proctoring_sessions');
        await pool.query('DELETE FROM course_stats');
        await pool.query('UPDATE files SET course_id = NULL');
        await pool.query('DELETE FROM lessons');
        await pool.query('DELETE FROM modules');
        await pool.query('DELETE FROM courses');
        console.log('✅ Successfully cleared all courses from the database!');
    } catch (err) {
        console.error('❌ Failed to clear courses:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

clearCourses();
