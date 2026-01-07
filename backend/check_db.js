const { ExamCategory } = require('./src/models');
const { sequelize } = require('./src/models');

async function check() {
    try {
        const categories = await ExamCategory.findAll();
        console.log('CATEGORIES:', JSON.stringify(categories, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
