// Script to generate JWT token for testing
const jwt = require('jsonwebtoken');
const { User } = require('../src/models');

async function generateTestToken() {
  try {
    console.log('🔑 Generating test JWT token...\n');

    // Find user with ID 6 (from the exam session)
    const user = await User.findByPk(6);
    
    if (!user) {
      console.log('❌ User with ID 6 not found');
      return;
    }

    console.log(`👤 Found user: ${user.username} (${user.email})`);

    // Generate JWT token
    const payload = {
      userId: user.user_id,
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    console.log('\n🎫 Generated JWT Token:');
    console.log(token);
    
    console.log('\n📋 Token payload:');
    console.log(JSON.stringify(payload, null, 2));

    console.log('\n🧪 Test command:');
    console.log(`curl -X GET "http://localhost:5000/api/exam-sessions/1/result-by-tags" \\`);
    console.log(`  -H "Authorization: Bearer ${token}" \\`);
    console.log(`  -H "Content-Type: application/json"`);

    return token;

  } catch (error) {
    console.error('❌ Error generating token:', error);
  }
}

// Run the script
if (require.main === module) {
  generateTestToken().then(() => process.exit(0));
}

module.exports = { generateTestToken };
