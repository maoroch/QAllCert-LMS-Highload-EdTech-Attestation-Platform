import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import config from './config/index.js';
import { UserModel } from './models/userModel.js';
import { TeacherProfileModel } from './models/teacherProfileModel.js';

dotenv.config();

const pool = new pg.Pool({ connectionString: config.postgresUri });

async function createTestTeacher() {
    try {
        console.log('🌱 Creating test teacher account...');
        await pool.connect();

        const userModel = new UserModel(pool);
        const teacherProfileModel = new TeacherProfileModel(pool);

        const email = 'teacher_test@example.com';
        const password = 'password123';

        // Check if the user already exists
        let user = await userModel.findByEmail(email);
        if (!user) {
            const passwordHash = await bcrypt.hash(password, 10);
            user = await userModel.create(email, passwordHash, 'teacher');
            await teacherProfileModel.create(user.id, 'Test Teacher');
            console.log(`\n✅ Test teacher account successfully created!`);
            console.log(`📧 Email:    ${email}`);
            console.log(`🔑 Password: ${password}`);
            console.log(`👤 Role:     teacher\n`);
        } else {
            console.log(`\nℹ️ Test teacher account already exists:`);
            console.log(`📧 Email:    ${user.email}`);
            console.log(`🔑 Password: ${password} (if unchanged)`);
            console.log(`👤 Role:     ${user.role}\n`);
        }
    } catch (err) {
        console.error('❌ Failed to create test teacher account:', err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

createTestTeacher();
