/**
 * Test Redis Connection
 * Chạy file này để kiểm tra Redis có kết nối được không
 * 
 * Usage: node test-redis.js
 */

const { createClient } = require('redis');

async function testRedis() {
  console.log('🔍 Testing Redis connection...');
  console.log('📍 URL:', process.env.REDIS_URL || 'redis://localhost:6379');
  console.log('');

  try {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
      }
    });

    client.on('error', (err) => {
      console.error('❌ Redis Error:', err.message);
    });

    client.on('connect', () => {
      console.log('🔄 Connecting to Redis...');
    });

    client.on('ready', () => {
      console.log('✅ Redis connected and ready!');
    });

    await client.connect();
    console.log('✅ Connection successful!');
    console.log('');

    // Test set/get
    console.log('🧪 Testing SET/GET...');
    await client.set('test_key', 'hello_redis');
    const value = await client.get('test_key');
    console.log('✅ SET test_key = "hello_redis"');
    console.log('✅ GET test_key =', value);
    console.log('');

    // Test exam cache format
    console.log('🧪 Testing exam cache format...');
    const testAnswers = [
      { question_id: 1, selected_choice_id: 10, updated_at: new Date().toISOString() },
      { question_id: 2, selected_choice_id: 20, updated_at: new Date().toISOString() }
    ];
    await client.setEx('exam:session:999:answers', 86400, JSON.stringify(testAnswers));
    const cachedAnswers = await client.get('exam:session:999:answers');
    console.log('✅ Saved test answers:', testAnswers);
    console.log('✅ Retrieved cached answers:', JSON.parse(cachedAnswers));
    console.log('');

    // Cleanup
    await client.del('test_key');
    await client.del('exam:session:999:answers');
    console.log('🧹 Cleaned up test data');
    console.log('');

    await client.quit();
    console.log('✅ Redis connection closed');
    console.log('');
    console.log('🎉 All tests passed! Redis is working correctly.');
    console.log('💡 You can now start your backend server.');
    
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Failed to connect to Redis!');
    console.error('Error:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Make sure Redis/Memurai is installed and running');
    console.error('   2. Check if port 6379 is accessible');
    console.error('   3. Try: Test-NetConnection -ComputerName localhost -Port 6379');
    console.error('   4. See REDIS_SETUP_WINDOWS.md for installation guide');
    console.error('');
    
    process.exit(1);
  }
}

testRedis();

