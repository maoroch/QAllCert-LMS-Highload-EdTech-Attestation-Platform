import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import config from './config/index.js';
import { UserModel } from './models/userModel.js';
import { CourseModel } from './models/courseModel.js';
import { ModuleModel } from './models/moduleModel.js';
import { LessonModel } from './models/lessonModel.js';
import { TeacherProfileModel } from './models/teacherProfileModel.js';
import { StudentProfileModel } from './models/studentProfileModel.js';
import { EnrollmentModel } from './models/enrollmentModel.js';

dotenv.config();

export async function seed(pool) {
    try {
        console.log('🌱 Starting database seed...');

        const userModel = new UserModel(pool);
        const courseModel = new CourseModel(pool);
        const moduleModel = new ModuleModel(pool);
        const lessonModel = new LessonModel(pool);
        const teacherProfileModel = new TeacherProfileModel(pool);
        const studentProfileModel = new StudentProfileModel(pool);
        const enrollmentModel = new EnrollmentModel(pool);

        // Find or create a teacher
        let teacher = await userModel.findByEmail('teacher@example.com');
        const teacherName = 'Александр Иванов (Преподаватель)';
        const teacherBio = 'Fullstack Developer с 10-летним опытом работы. Специализируюсь на React, Node.js, Next.js and PostgreSQL. Эксперт по системной архитектуре и менторству.';
        const teacherAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop';

        if (!teacher) {
            const passwordHash = await bcrypt.hash('password123', 10);
            teacher = await userModel.create(
                'teacher@example.com',
                passwordHash,
                'teacher'
            );
            await teacherProfileModel.create(teacher.id, teacherName, teacherBio, teacherAvatar);
            console.log('✅ Created example teacher: teacher@example.com / password123');
        } else {
            console.log('✅ Found existing teacher:', teacher.email);
            await teacherProfileModel.update(teacher.id, {
                fullName: teacherName,
                bio: teacherBio,
                avatarUrl: teacherAvatar
            });
            console.log('🔄 Updated existing teacher profile details');
        }

        // Find or create Course 1
        let course1;
        const resCourse1 = await pool.query('SELECT * FROM courses WHERE title = $1', ['Fullstack Web Development Bootcamp']);
        if (resCourse1.rows.length === 0) {
            course1 = await courseModel.create({
                title: 'Fullstack Web Development Bootcamp',
                description: 'Learn to build fullstack web applications using React, Node.js, and PostgreSQL.',
                teacherId: teacher.id
            });
            course1 = await courseModel.update(course1.id, { is_published: true, price: 99.00 });
            console.log(`✅ Created Course: ${course1.title} (Published)`);
        } else {
            course1 = resCourse1.rows[0];
            console.log(`✅ Found existing Course: ${course1.title}`);
        }

        // Course 1 - Module 1
        let c1m1;
        const resC1M1 = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND title = $2', [course1.id, 'Frontend Basics']);
        if (resC1M1.rows.length === 0) {
            c1m1 = await moduleModel.create({ courseId: course1.id, title: 'Frontend Basics', orderIndex: 1 });
            console.log(`✅ Created Module: Frontend Basics`);
        } else {
            c1m1 = resC1M1.rows[0];
            console.log(`✅ Found existing Module: Frontend Basics`);
        }

        // Lessons for Module 1
        const resL1_1 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c1m1.id, 'HTML & CSS Fundamentals']);
        if (resL1_1.rows.length === 0) {
            await lessonModel.create({
                moduleId: c1m1.id,
                title: 'HTML & CSS Fundamentals',
                contentType: 'video',
                content: 'In this video lesson, we will cover the basics of HTML5 and CSS3 styling techniques.',
                orderIndex: 1
            });
            console.log(`✅ Created Lesson: HTML & CSS Fundamentals`);
        }

        const resL1_2 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c1m1.id, 'Responsive Design with Tailwind']);
        if (resL1_2.rows.length === 0) {
            await lessonModel.create({
                moduleId: c1m1.id,
                title: 'Responsive Design with Tailwind',
                contentType: 'text',
                content: 'Tailwind CSS allows you to rapidly build custom user interfaces. Read this guide to understand utility classes.',
                orderIndex: 2
            });
            console.log(`✅ Created Lesson: Responsive Design with Tailwind`);
        }

        // Course 1 - Module 2
        let c1m2;
        const resC1M2 = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND title = $2', [course1.id, 'React JS']);
        if (resC1M2.rows.length === 0) {
            c1m2 = await moduleModel.create({ courseId: course1.id, title: 'React JS', orderIndex: 2 });
            console.log(`✅ Created Module: React JS`);
        } else {
            c1m2 = resC1M2.rows[0];
            console.log(`✅ Found existing Module: React JS`);
        }

        // Lessons for Module 2
        const resL2_1 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c1m2.id, 'React Components and Props']);
        if (resL2_1.rows.length === 0) {
            await lessonModel.create({
                moduleId: c1m2.id,
                title: 'React Components and Props',
                contentType: 'video',
                content: 'Understanding the building blocks of a React application.',
                orderIndex: 1
            });
            console.log(`✅ Created Lesson: React Components and Props`);
        }

        const resL2_2 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c1m2.id, 'State Management with Hooks']);
        if (resL2_2.rows.length === 0) {
            await lessonModel.create({
                moduleId: c1m2.id,
                title: 'State Management with Hooks',
                contentType: 'practice',
                content: 'Create a simple counter application using the useState hook.',
                orderIndex: 2
            });
            console.log(`✅ Created Lesson: State Management with Hooks`);
        }


        // Find or create Course 2
        let course2;
        const resCourse2 = await pool.query('SELECT * FROM courses WHERE title = $1', ['Introduction to Data Science']);
        if (resCourse2.rows.length === 0) {
            course2 = await courseModel.create({
                title: 'Introduction to Data Science',
                description: 'A beginner-friendly guide to data analysis and visualization using Python.',
                teacherId: teacher.id
            });
            course2 = await courseModel.update(course2.id, { is_published: true, price: 149.00 });
            console.log(`✅ Created Course: ${course2.title} (Published)`);
        } else {
            course2 = resCourse2.rows[0];
            console.log(`✅ Found existing Course: ${course2.title}`);
        }

        // Course 2 - Module 1
        let c2m1;
        const resC2M1 = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND title = $2', [course2.id, 'Python Basics']);
        if (resC2M1.rows.length === 0) {
            c2m1 = await moduleModel.create({ courseId: course2.id, title: 'Python Basics', orderIndex: 1 });
            console.log(`✅ Created Module: Python Basics`);
        } else {
            c2m1 = resC2M1.rows[0];
            console.log(`✅ Found existing Module: Python Basics`);
        }

        // Lessons for Course 2 Module 1
        const resL3_1 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c2m1.id, 'Variables and Data Types']);
        if (resL3_1.rows.length === 0) {
            await lessonModel.create({
                moduleId: c2m1.id,
                title: 'Variables and Data Types',
                contentType: 'text',
                content: 'Learn about integers, floats, strings, and booleans in Python.',
                orderIndex: 1
            });
            console.log(`✅ Created Lesson: Variables and Data Types`);
        }

        const resL3_2 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c2m1.id, 'Control Flow: Loops & Conditions']);
        if (resL3_2.rows.length === 0) {
            await lessonModel.create({
                moduleId: c2m1.id,
                title: 'Control Flow: Loops & Conditions',
                contentType: 'video',
                content: 'Learn how to use if/else statements and for/while loops in Python to control the flow of your program.',
                orderIndex: 2
            });
            console.log(`✅ Created Lesson: Control Flow: Loops & Conditions`);
        }

        const resL3_3 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c2m1.id, 'Functions and Scope']);
        if (resL3_3.rows.length === 0) {
            await lessonModel.create({
                moduleId: c2m1.id,
                title: 'Functions and Scope',
                contentType: 'practice',
                content: 'Write reusable functions, understand arguments, return values, and variable scopes.',
                orderIndex: 3
            });
            console.log(`✅ Created Lesson: Functions and Scope`);
        }

        // Course 2 - Module 2
        let c2m2;
        const resC2M2 = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND title = $2', [course2.id, 'Data Analysis with Pandas']);
        if (resC2M2.rows.length === 0) {
            c2m2 = await moduleModel.create({ courseId: course2.id, title: 'Data Analysis with Pandas', orderIndex: 2 });
            console.log(`✅ Created Module: Data Analysis with Pandas`);
        } else {
            c2m2 = resC2M2.rows[0];
            console.log(`✅ Found existing Module: Data Analysis with Pandas`);
        }

        // Lessons for Module 2
        const resL3_4 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c2m2.id, 'Pandas DataFrames Basics']);
        if (resL3_4.rows.length === 0) {
            await lessonModel.create({
                moduleId: c2m2.id,
                title: 'Pandas DataFrames Basics',
                contentType: 'video',
                content: 'Introduction to Pandas Series and DataFrames. Learn how to load, filter, and inspect CSV datasets.',
                orderIndex: 1
            });
            console.log(`✅ Created Lesson: Pandas DataFrames Basics`);
        }

        const resL3_5 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c2m2.id, 'Data Cleaning Techniques']);
        if (resL3_5.rows.length === 0) {
            await lessonModel.create({
                moduleId: c2m2.id,
                title: 'Data Cleaning Techniques',
                contentType: 'text',
                content: 'Handling missing values, renaming columns, drop duplicates, and type conversion in Pandas.',
                orderIndex: 2
            });
            console.log(`✅ Created Lesson: Data Cleaning Techniques`);
        }

        const resL3_6 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c2m2.id, 'Grouping and Aggregation']);
        if (resL3_6.rows.length === 0) {
            await lessonModel.create({
                moduleId: c2m2.id,
                title: 'Grouping and Aggregation',
                contentType: 'practice',
                content: 'Learn to use groupby, merge, and pivot tables to summarize structured data.',
                orderIndex: 3
            });
            console.log(`✅ Created Lesson: Grouping and Aggregation`);
        }

        // Course 2 - Module 3 (Final Module)
        let c2m3;
        const resC2M3 = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND title = $2', [course2.id, 'Data Visualization']);
        if (resC2M3.rows.length === 0) {
            c2m3 = await moduleModel.create({
                courseId: course2.id,
                title: 'Data Visualization',
                orderIndex: 3,
                isFinal: true,
                completionMessage: 'Congratulations on completing the Data Science course! You are now ready to visualize and share data insights.'
            });
            console.log(`✅ Created Module: Data Visualization`);
        } else {
            c2m3 = resC2M3.rows[0];
            console.log(`✅ Found existing Module: Data Visualization`);
        }

        // Lessons for Module 3
        const resL3_7 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c2m3.id, 'Plotting with Matplotlib & Seaborn']);
        if (resL3_7.rows.length === 0) {
            await lessonModel.create({
                moduleId: c2m3.id,
                title: 'Plotting with Matplotlib & Seaborn',
                contentType: 'video',
                content: 'Create line plots, bar charts, scatter plots, and histograms to visualize data distributions.',
                orderIndex: 1
            });
            console.log(`✅ Created Lesson: Plotting with Matplotlib & Seaborn`);
        }

        const resL3_8 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c2m3.id, 'Building Dashboard Visuals']);
        if (resL3_8.rows.length === 0) {
            await lessonModel.create({
                moduleId: c2m3.id,
                title: 'Building Dashboard Visuals',
                contentType: 'practice',
                content: 'Design clean charts with proper labels, colors, and layouts for presentations.',
                orderIndex: 2
            });
            console.log(`✅ Created Lesson: Building Dashboard Visuals`);
        }


        // Find or create Course 3
        let course3;
        const resCourse3 = await pool.query('SELECT * FROM courses WHERE title = $1', ['UI/UX Design Masterclass']);
        if (resCourse3.rows.length === 0) {
            course3 = await courseModel.create({
                title: 'UI/UX Design Masterclass',
                description: 'Master Figma, user research, prototyping, and modern interface design principles.',
                teacherId: teacher.id
            });
            course3 = await courseModel.update(course3.id, { is_published: true, price: 79.00 });
            console.log(`✅ Created Course: ${course3.title} (Published)`);
        } else {
            course3 = resCourse3.rows[0];
            console.log(`✅ Found existing Course: ${course3.title}`);
        }

        // Course 3 - Module 1
        let c3m1;
        const resC3M1 = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND title = $2', [course3.id, 'Figma Essentials']);
        if (resC3M1.rows.length === 0) {
            c3m1 = await moduleModel.create({ courseId: course3.id, title: 'Figma Essentials', orderIndex: 1 });
            console.log(`✅ Created Module: Figma Essentials`);
        } else {
            c3m1 = resC3M1.rows[0];
            console.log(`✅ Found existing Module: Figma Essentials`);
        }

        // Lessons for Course 3 Module 1
        const resL4_1 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c3m1.id, 'Introduction to Figma Tools']);
        if (resL4_1.rows.length === 0) {
            await lessonModel.create({
                moduleId: c3m1.id,
                title: 'Introduction to Figma Tools',
                contentType: 'video',
                content: 'Get familiar with Figma interface, vector networks, and basic design workspace setup.',
                orderIndex: 1
            });
            console.log(`✅ Created Lesson: Introduction to Figma Tools`);
        }

        const resL4_2 = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [c3m1.id, 'Components and Auto Layout']);
        if (resL4_2.rows.length === 0) {
            await lessonModel.create({
                moduleId: c3m1.id,
                title: 'Components and Auto Layout',
                contentType: 'practice',
                content: 'Practice creating responsive components using Figma Auto Layout.',
                orderIndex: 2
            });
            console.log(`✅ Created Lesson: Components and Auto Layout`);
        }


        // Find or create a student
        let student = await userModel.findByEmail('student@example.com');
        const studentName = 'Алиса Смирнова (Студент)';
        const studentAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
        const studentMetadata = { skills: ['JavaScript', 'HTML', 'CSS'], goal: 'Become a Frontend Developer', experience: 'Beginner' };
        const studentPhone = '+7 (777) 123-45-67';

        if (!student) {
            const passwordHash = await bcrypt.hash('password123', 10);
            student = await userModel.create(
                'student@example.com',
                passwordHash,
                'student'
            );
            await studentProfileModel.create(student.id, studentName, studentAvatar, studentMetadata);
            await studentProfileModel.update(student.id, { phoneNumber: studentPhone });
            console.log('✅ Created example student: student@example.com / password123');
        } else {
            console.log('✅ Found existing student:', student.email);
            await studentProfileModel.update(student.id, {
                fullName: studentName,
                avatarUrl: studentAvatar,
                metadata: studentMetadata,
                phoneNumber: studentPhone
            });
            console.log('🔄 Updated existing student profile details');
        }

        // Enroll student in Course 1
        const resEnroll = await pool.query('SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2', [student.id, course1.id]);
        if (resEnroll.rows.length === 0) {
            await enrollmentModel.enroll(student.id, course1.id);
            console.log(`✅ Enrolled student in Course: ${course1.title}`);
        } else {
            console.log(`✅ Student already enrolled in Course: ${course1.title}`);
        }

        // ── Seed 4 Real Accredited Teacher Development Courses (QAllCert) ──
        const officialCourses = [
            {
                slug: 'math-trigonometry-80h',
                title: '«Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктер» тарауына проблемалық оқыту технологиясын пайдалану',
                description: 'Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктерді оқытуда проблемалық оқыту әдістемесін қолдану. Аттестаттауға арналған 80 академиялық сағаттық аккредиттелген ресми курс.',
                price: 15000.00,
                modules: [
                    {
                        title: '1-модуль. Проблемалық оқытудың теориялық негіздері (8 сағат)',
                        lessons: [
                            { title: 'Проблемалық оқыту концепциясы және оның математикадағы маңызы', type: 'video' },
                            { title: 'Оқушылардың танымдық белсенділігін арттыру әдістері', type: 'text' }
                        ]
                    },
                    {
                        title: '2-модуль. Тригонометриялық теңдеулер мен теңсіздіктерді шешудің стандартты емес әдістері (32 сағат)',
                        lessons: [
                            { title: 'Күрделі тригонометриялық теңдеулерді жіктеу', type: 'video' },
                            { title: 'Параметрлі тригонометриялық теңсіздіктерді шешу практикасы', type: 'practice' }
                        ]
                    },
                    {
                        title: '3-модуль. Оқушылардың математикалық сауаттылығын дамыту (30 сағат)',
                        lessons: [
                            { title: 'Функционалдық сауаттылықты арттыруға арналған қолданбалы есептер', type: 'text' },
                            { title: 'PISA және ҰБТ есептерін талдау әдістемесі', type: 'practice' }
                        ]
                    },
                    {
                        title: '4-модуль. Қорытынды бағалау және аттестаттау тесті (10 сағат)',
                        lessons: [
                            { title: '80 академиялық сағаттық қорытынды тестілеу', type: 'practice' }
                        ]
                    }
                ]
            },
            {
                slug: 'python-pedagog-80h',
                title: '«Python бағдарламалау тілі: теориясы мен практикасы»',
                description: 'Мектеп мұғалімдері мен жаңадан бастаушыларға арналған Python программалау тілін оқыту әдістемесі мен практикасы. Аттестаттауға арналған 80 академиялық сағаттық ресми курс.',
                price: 15000.00,
                modules: [
                    {
                        title: '1-модуль. Мектепте Python тілін оқыту әдістемесі мен синтаксис (20 сағат)',
                        lessons: [
                            { title: 'Python ортасын орнату және қарапайым алгоритмдер', type: 'video' },
                            { title: 'Деректер типтері және шартты операторлар', type: 'practice' }
                        ]
                    },
                    {
                        title: '2-модуль. Алгоритмдер мен деректер құрылымы (25 сағат)',
                        lessons: [
                            { title: 'Тізімдер (list), сөздіктер (dict) және жиындар (set)', type: 'video' },
                            { title: 'Мектеп олимпиадасының есептерін Python-да шешу', type: 'practice' }
                        ]
                    },
                    {
                        title: '3-модуль. Графика және оқу жобалары (25 сағат)',
                        lessons: [
                            { title: 'Turtle және Pygame модульдерімен графикалық ойындар жасау', type: 'text' },
                            { title: 'Мектепке арналған оқу-ақпараттық Telegram-бот құрастыру', type: 'practice' }
                        ]
                    },
                    {
                        title: '4-модуль. Қорытынды практикалық жоба (10 сағат)',
                        lessons: [
                            { title: 'Авторлық жобаны қорғау және 80 сағаттық қорытынды тест', type: 'practice' }
                        ]
                    }
                ]
            },
            {
                slug: 'steam-education-80h',
                title: '«STEAM білім беру: білім алушылармен жұмыс жасау технологиялары мен формалары»',
                description: 'Мектепте STEAM оқыту әдістемесін енгізу, пәнаралық байланыс, жобалық жұмыстар мен дайын сабақ жоспарлары. 80 академиялық сағаттық біліктілікті арттыру курсы.',
                price: 15000.00,
                modules: [
                    {
                        title: '1-модуль. STEAM білім беру тұжырымдамасы (15 сағат)',
                        lessons: [
                            { title: 'STEAM философиясы және халықаралық үздік тәжірибелер', type: 'video' },
                            { title: 'STEAM пәндерін интеграциялау принциптері', type: 'text' }
                        ]
                    },
                    {
                        title: '2-модуль. Пәнаралық байланыс және инженерия (25 сағат)',
                        lessons: [
                            { title: 'Ғылым, технология және өнерді сабақта тоғыстыру', type: 'video' },
                            { title: 'Оқушылармен ғылыми-зерттеу жобаларын жүргізу', type: 'practice' }
                        ]
                    },
                    {
                        title: '3-модуль. STEAM сабақ жоспарлары мен зертханалар (30 сағат)',
                        lessons: [
                            { title: 'Қолжетімді материалдармен STEAM тәжірибелер жасау', type: 'text' },
                            { title: 'ҚМЖ үлгілері және критериалды бағалау', type: 'practice' }
                        ]
                    },
                    {
                        title: '4-модуль. Сертификаттау және қорытынды сараптама (10 сағат)',
                        lessons: [
                            { title: '80 академиялық сағаттық аттестациялық бақылау', type: 'practice' }
                        ]
                    }
                ]
            },
            {
                slug: 'ai-education-86h',
                title: '«Білім берудегі жасанды интеллект технологиялары: теориясы мен практикасы»',
                description: 'Сабақ беруде жасанды интеллект (ChatGPT, нейрожелілер) құралдарын тиімді қолдану. 86 академиялық сағаттық ресми аккредиттелген курс.',
                price: 18000.00,
                modules: [
                    {
                        title: '1-модуль. Білім берудегі жасанды интеллект парадигмасы (16 сағат)',
                        lessons: [
                            { title: 'ЖИ негіздері, этикасы және мектептегі қолданылуы', type: 'video' },
                            { title: 'Педагогқа арналған заманауи нейрожелілер шолуы', type: 'text' }
                        ]
                    },
                    {
                        title: '2-модуль. Сабақ жоспарлау және материал дайындау (30 сағат)',
                        lessons: [
                            { title: 'Промпт-инжиниринг: сабақ жоспарларын 5 минутта генерациялау', type: 'practice' },
                            { title: 'Әртүрлі деңгейлі дидактикалық тапсырмалар құрастыру', type: 'practice' }
                        ]
                    },
                    {
                        title: '3-модуль. Визуалды және интерактивті контент жасау (30 сағат)',
                        lessons: [
                            { title: 'Нейрожелілер арқылы оқу презентациялары мен суреттер жасау', type: 'video' },
                            { title: 'Тесттер, викториналар мен интерактивті бағалау жүйелері', type: 'practice' }
                        ]
                    },
                    {
                        title: '4-модуль. Қорытынды аттестаттау (10 сағат)',
                        lessons: [
                            { title: 'AI-қолданылған авторлық сабақ жобасын тапсыру және 86 сағаттық тест', type: 'practice' }
                        ]
                    }
                ]
            }
        ];

        for (const offCourse of officialCourses) {
            let dbCourse;
            const resC = await pool.query('SELECT * FROM courses WHERE title = $1 OR slug = $2', [offCourse.title, offCourse.slug]);
            if (resC.rows.length === 0) {
                dbCourse = await courseModel.create({
                    title: offCourse.title,
                    description: offCourse.description,
                    teacherId: teacher.id,
                    slug: offCourse.slug
                });
                await courseModel.update(dbCourse.id, { is_published: true, price: offCourse.price, slug: offCourse.slug });
                console.log(`✅ Created Official Course: ${offCourse.title}`);
            } else {
                dbCourse = resC.rows[0];
                await courseModel.update(dbCourse.id, { is_published: true, price: offCourse.price, description: offCourse.description, slug: offCourse.slug });
                console.log(`✅ Found existing Official Course: ${offCourse.title}`);
            }

            for (let mIdx = 0; mIdx < offCourse.modules.length; mIdx++) {
                const modData = offCourse.modules[mIdx];
                let dbMod;
                const resM = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND title = $2', [dbCourse.id, modData.title]);
                if (resM.rows.length === 0) {
                    dbMod = await moduleModel.create({ courseId: dbCourse.id, title: modData.title, orderIndex: mIdx + 1 });
                    console.log(`   ✅ Module: ${modData.title}`);
                } else {
                    dbMod = resM.rows[0];
                }

                for (let lIdx = 0; lIdx < modData.lessons.length; lIdx++) {
                    const lData = modData.lessons[lIdx];
                    const resL = await pool.query('SELECT * FROM lessons WHERE module_id = $1 AND title = $2', [dbMod.id, lData.title]);
                    if (resL.rows.length === 0) {
                        await lessonModel.create({
                            moduleId: dbMod.id,
                            title: lData.title,
                            contentType: lData.type,
                            content: `Сабақ мазмұны: ${lData.title}. Педагогтардың біліктілігін арттыру бағдарламасына сәйкес дайындалған.`,
                            orderIndex: lIdx + 1
                        });
                    }
                }
            }
        }

        console.log('🎉 Seed completed successfully!');
    } catch (err) {
        console.error('❌ Seed failed:', err);
        throw err;
    }
}

import { fileURLToPath } from 'url';
const isMain = process.argv[1] && (process.argv[1].endsWith('seed.js') || fileURLToPath(import.meta.url) === process.argv[1]);

if (isMain) {
    const pool = new pg.Pool({ connectionString: config.postgresUri });
    seed(pool)
        .catch(err => console.error('❌ Seed execution failed:', err))
        .finally(async () => {
            await pool.end();
            process.exit(0);
        });
}
