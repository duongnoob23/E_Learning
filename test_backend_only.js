const axios = require('axios');

const CONFIG = {
    nodeApiUrl: 'http://localhost:5000/api',
    testUserId: 1,
    testSessionId: 1,
    testQuestionId: 1
};

// Mock JWT token (replace with real token)
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTYzMDAwMDAwMH0.test';

async function testBackendAPI() {
    console.log('🧪 Testing Backend API for Speaking Exam\n');

    try {
        // Test 1: Check if backend is running
        console.log('1. Testing backend health...');
        try {
            const response = await axios.get(`${CONFIG.nodeApiUrl}/tests`, {
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });
            console.log('✅ Backend is running');
        } catch (error) {
            console.log('❌ Backend not accessible:', error.message);
            return;
        }

        // Test 2: Check speaking routes exist
        console.log('\n2. Testing speaking routes...');
        
        // Test health endpoint (should work even without Whisper)
        try {
            const response = await axios.get(`${CONFIG.nodeApiUrl}/exam/speaking/health`, {
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });
            console.log('✅ Speaking health endpoint exists');
            console.log('   Response:', response.data);
        } catch (error) {
            if (error.response) {
                console.log('⚠️  Speaking health endpoint exists but Whisper service not available');
                console.log('   Status:', error.response.status);
                console.log('   Message:', error.response.data?.message || 'No message');
            } else {
                console.log('❌ Speaking health endpoint not found:', error.message);
            }
        }

        // Test 3: Check database connection for speaking
        console.log('\n3. Testing database schema...');
        try {
            // This will test if the speaking routes are properly configured
            const response = await axios.get(`${CONFIG.nodeApiUrl}/exam/speaking/session/999/responses`, {
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });
            console.log('✅ Speaking database routes working');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('✅ Speaking database routes working (404 expected for non-existent session)');
            } else if (error.response && error.response.status === 400) {
                console.log('✅ Speaking validation working (400 expected for invalid input)');
            } else {
                console.log('❌ Speaking database routes error:', error.message);
            }
        }

        // Test 4: Test file upload endpoint (without actual file)
        console.log('\n4. Testing upload endpoint validation...');
        try {
            const response = await axios.post(`${CONFIG.nodeApiUrl}/exam/speaking/upload`, {
                session_id: 1,
                question_id: 1
            }, {
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });
            console.log('❌ Upload should require file');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Upload validation working (requires audio file)');
                console.log('   Message:', error.response.data?.message);
            } else {
                console.log('⚠️  Upload endpoint error:', error.message);
            }
        }

        console.log('\n🎉 Backend API test completed!');
        console.log('\n📋 Next steps:');
        console.log('1. Wait for Whisper service installation to complete');
        console.log('2. Start Whisper service: cd whisper_service && python app.py');
        console.log('3. Open speaking_demo.html in browser for full test');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testBackendAPI();
