const { Sequelize } = require('sequelize');
require('dotenv').config();

async function runMigration() {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    });

    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Add columns to speaking_responses
        console.log('\n📝 Adding columns to speaking_responses table...');
        
        const columnsToAdd = [
            { name: 'pronunciation_score', type: 'FLOAT', comment: 'Pronunciation score (0-100)' },
            { name: 'fluency_score', type: 'FLOAT', comment: 'Fluency score (0-100) - from MultiPA' },
            { name: 'prosody_score', type: 'FLOAT', comment: 'Prosody score (0-100) - from MultiPA' },
            { name: 'transcript', type: 'TEXT', comment: 'MultiPA transcription result' },
            { name: 'grammar_score', type: 'FLOAT', comment: 'Grammar score (0-100)' },
            { name: 'vocabulary_score', type: 'FLOAT', comment: 'Vocabulary score (0-100)' },
            { name: 'coherence_score', type: 'FLOAT', comment: 'Coherence/Organization score (0-100)' },
            { name: 'detailed_feedback', type: 'JSON', comment: 'Detailed feedback for each criterion' }
        ];

        for (const col of columnsToAdd) {
            try {
                const sql = `ALTER TABLE speaking_responses ADD COLUMN ${col.name} ${col.type} COMMENT '${col.comment}'`;
                await sequelize.query(sql);
                console.log(`   ✅ Added column: ${col.name}`);
            } catch (error) {
                if (error.message.includes('Duplicate column')) {
                    console.log(`   ⚠️  Column ${col.name} already exists, skipping`);
                } else {
                    console.log(`   ❌ Error adding ${col.name}: ${error.message}`);
                }
            }
        }

        // Verify columns
        console.log('\n🔍 Verifying database schema...');
        const [columns] = await sequelize.query("DESCRIBE speaking_responses");
        console.log('📋 speaking_responses table columns:');
        columns.forEach(col => {
            console.log(`   - ${col.Field}: ${col.Type}`);
        });

        console.log('\n🎉 Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await sequelize.close();
    }
}

runMigration();

