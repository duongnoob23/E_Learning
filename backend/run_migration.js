const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: console.log
    });

    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Read migration file
        const migrationPath = path.join(__dirname, 'migrations', 'add_speaking_support.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        // Split by semicolon and filter out empty statements
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('USE'));

        console.log(`\n📝 Found ${statements.length} SQL statements to execute\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`${i + 1}. Executing: ${statement.substring(0, 50)}...`);
            
            try {
                await sequelize.query(statement);
                console.log('   ✅ Success');
            } catch (error) {
                if (error.message.includes('Duplicate column') || 
                    error.message.includes('already exists') ||
                    error.message.includes('Table') && error.message.includes('already exists')) {
                    console.log('   ⚠️  Already exists, skipping');
                } else {
                    console.log('   ❌ Error:', error.message);
                }
            }
        }

        console.log('\n🎉 Migration completed!');

        // Verify tables exist
        console.log('\n🔍 Verifying database schema...');
        
        const [results] = await sequelize.query("SHOW TABLES LIKE 'speaking_responses'");
        if (results.length > 0) {
            console.log('✅ speaking_responses table exists');
            
            // Check table structure
            const [columns] = await sequelize.query("DESCRIBE speaking_responses");
            console.log('📋 Table structure:');
            columns.forEach(col => {
                console.log(`   - ${col.Field}: ${col.Type}`);
            });
        } else {
            console.log('❌ speaking_responses table not found');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await sequelize.close();
    }
}

runMigration();
