const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Kiểm tra xem user demo đã tồn tại chưa
    const existingUser = await queryInterface.sequelize.query(
      'SELECT user_id FROM users WHERE username = "demo_user" LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingUser.length > 0) {
      console.log('Demo user already exists, skipping...');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Tạo user demo
    await queryInterface.bulkInsert('users', [
      {
        user_id: 1,
        username: 'demo_user',
        email: 'demo@example.com',
        password: hashedPassword,
        full_name: 'Demo User',
        role: 'STUDENT',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    console.log('Demo user created successfully');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      username: 'demo_user'
    });
  }
};
