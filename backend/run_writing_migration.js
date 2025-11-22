const db = require('./src/models');

async function runMigration() {
    try {
        console.log('🔄 Starting migration for writing_responses table...');
        
        // Get the migration
        const migration = require('./migrations/add_writing_multipa_scores.js');
        
        // Run the up migration
        await migration.up(db.sequelize.getQueryInterface(), db.sequelize.Sequelize);
        
        console.log('✅ Migration completed successfully!');
        
        // Verify columns
        const tableDescription = await db.sequelize.getQueryInterface().describeTable('writing_responses');
        console.log('\n📋 writing_responses columns:');
        Object.keys(tableDescription).forEach(col => {
            console.log(`  - ${col}: ${tableDescription[col].type}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

runMigration();

