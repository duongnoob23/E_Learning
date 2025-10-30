const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

async function createSpeakingTables() {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: console.log
    });

    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // 1. Update questions table to support SPEAKING type
        console.log('\n1. Updating questions table...');
        try {
            await sequelize.query(`
                ALTER TABLE questions 
                MODIFY COLUMN question_type ENUM('MULTIPLE_CHOICE', 'FILL_BLANK', 'READING_COMPREHENSION', 'SPEAKING') NOT NULL
            `);
            console.log('✅ Questions table updated');
        } catch (error) {
            console.log('⚠️  Questions table already updated or error:', error.message);
        }

        // 2. Update parts table to support SPEAKING type
        console.log('\n2. Updating parts table...');
        try {
            await sequelize.query(`
                ALTER TABLE parts 
                MODIFY COLUMN part_type ENUM('LISTENING', 'READING', 'SPEAKING') NOT NULL
            `);
            console.log('✅ Parts table updated');
        } catch (error) {
            console.log('⚠️  Parts table already updated or error:', error.message);
        }

        // 3. Create speaking_responses table
        console.log('\n3. Creating speaking_responses table...');
        try {
            await sequelize.query(`
                CREATE TABLE speaking_responses (
                    response_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                    session_id BIGINT UNSIGNED NOT NULL,
                    question_id BIGINT UNSIGNED NOT NULL,
                    user_id BIGINT UNSIGNED NOT NULL,
                    audio_file_path VARCHAR(500) NOT NULL,
                    transcription TEXT NULL,
                    confidence_score DECIMAL(5,4) NULL,
                    duration_seconds DECIMAL(8,2) NULL,
                    language_detected VARCHAR(10) NULL,
                    processing_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
                    error_message TEXT NULL,
                    score DECIMAL(5,2) NULL,
                    feedback TEXT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    
                    FOREIGN KEY (session_id) REFERENCES exam_sessions(session_id) ON DELETE CASCADE,
                    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    
                    INDEX idx_session_id (session_id),
                    INDEX idx_question_id (question_id),
                    INDEX idx_user_id (user_id),
                    INDEX idx_processing_status (processing_status),
                    INDEX idx_created_at (created_at)
                )
            `);
            console.log('✅ speaking_responses table created');
        } catch (error) {
            console.log('⚠️  speaking_responses table already exists or error:', error.message);
        }

        // 4. Insert sample speaking questions
        console.log('\n4. Creating sample speaking test data...');
        
        // First, create a test with speaking part
        const [testResult] = await sequelize.query(`
            INSERT INTO tests (test_name, description, duration_minutes, total_questions, difficulty_level, is_active, created_by)
            VALUES ('Speaking Test Demo', 'Demo test for speaking functionality', 30, 3, 'INTERMEDIATE', 1, 1)
            ON DUPLICATE KEY UPDATE test_id = LAST_INSERT_ID(test_id)
        `);
        
        const testId = testResult.insertId || testResult;
        console.log('✅ Test created with ID:', testId);

        // Create speaking part
        const [partResult] = await sequelize.query(`
            INSERT INTO parts (test_id, part_name, part_type, part_order, instructions)
            VALUES (${testId}, 'Speaking Part', 'SPEAKING', 1, 'Please answer the following speaking questions clearly.')
            ON DUPLICATE KEY UPDATE part_id = LAST_INSERT_ID(part_id)
        `);
        
        const partId = partResult.insertId || partResult;
        console.log('✅ Speaking part created with ID:', partId);

        // Create speaking questions
        const speakingQuestions = [
            {
                question_text: 'Introduce yourself and talk about your hobbies. (Speak for 1-2 minutes)',
                question_type: 'SPEAKING',
                points: 10
            },
            {
                question_text: 'Describe your favorite place to visit and explain why you like it. (Speak for 1-2 minutes)',
                question_type: 'SPEAKING', 
                points: 10
            },
            {
                question_text: 'What are your career goals and how do you plan to achieve them? (Speak for 2-3 minutes)',
                question_type: 'SPEAKING',
                points: 15
            }
        ];

        for (let i = 0; i < speakingQuestions.length; i++) {
            const q = speakingQuestions[i];
            await sequelize.query(`
                INSERT INTO questions (part_id, question_text, question_type, question_order, points)
                VALUES (${partId}, '${q.question_text}', '${q.question_type}', ${i + 1}, ${q.points})
            `);
        }
        
        console.log('✅ Sample speaking questions created');

        // 5. Verify setup
        console.log('\n5. Verifying setup...');
        
        const [tables] = await sequelize.query("SHOW TABLES LIKE 'speaking_responses'");
        if (tables.length > 0) {
            console.log('✅ speaking_responses table exists');
            
            const [columns] = await sequelize.query("DESCRIBE speaking_responses");
            console.log('📋 Table columns:', columns.length);
        }

        const [questions] = await sequelize.query("SELECT COUNT(*) as count FROM questions WHERE question_type = 'SPEAKING'");
        console.log('📝 Speaking questions:', questions[0].count);

        console.log('\n🎉 Speaking exam setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Start Whisper service: cd whisper_service && python app.py');
        console.log('2. Start Node.js backend: npm start');
        console.log('3. Open speaking_demo.html in browser');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        await sequelize.close();
    }
}

createSpeakingTables();
