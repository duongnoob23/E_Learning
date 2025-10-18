// Test script for Result By Tags API
// Run this with: node test/test-result-by-tags.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data - replace with actual values from your database
const TEST_DATA = {
  // You need to get a valid JWT token first
  token: 'your-jwt-token-here',
  // You need a completed exam session ID
  sessionId: 1
};

async function testResultByTagsAPI() {
  try {
    console.log('🧪 Testing Result By Tags API...');
    console.log('📍 Endpoint:', `${BASE_URL}/exam-sessions/${TEST_DATA.sessionId}/result-by-tags`);
    
    const response = await axios.get(
      `${BASE_URL}/exam-sessions/${TEST_DATA.sessionId}/result-by-tags`,
      {
        headers: {
          'Authorization': `Bearer ${TEST_DATA.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ API Response Status:', response.status);
    console.log('📊 Response Data:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.EC === "0") {
      const { session_info, overall_statistics, tag_analysis } = response.data.DT;
      
      console.log('\n📈 Analysis Summary:');
      console.log(`Session ID: ${session_info.session_id}`);
      console.log(`Total Score: ${session_info.total_score}`);
      console.log(`Overall Accuracy: ${overall_statistics.overall_accuracy}%`);
      console.log(`Total Questions: ${overall_statistics.total_questions}`);
      
      console.log('\n🏷️ Tag Analysis:');
      tag_analysis.forEach((tag, index) => {
        console.log(`${index + 1}. ${tag.tag_name}`);
        console.log(`   Accuracy: ${tag.accuracy_rate}%`);
        console.log(`   Correct: ${tag.correct_answers}/${tag.total_questions}`);
        console.log(`   Questions: ${tag.question_list.length} items`);
      });
    }

  } catch (error) {
    console.error('❌ Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Helper function to get a demo token (if you have the demo endpoint)
async function getDemoToken() {
  try {
    const response = await axios.get(`${BASE_URL}/demo-token`);
    return response.data.token;
  } catch (error) {
    console.error('Could not get demo token:', error.message);
    return null;
  }
}

// Main test function
async function runTest() {
  console.log('🚀 Starting Result By Tags API Test\n');
  
  // Try to get demo token if not provided
  if (TEST_DATA.token === 'your-jwt-token-here') {
    console.log('🔑 Attempting to get demo token...');
    const demoToken = await getDemoToken();
    if (demoToken) {
      TEST_DATA.token = demoToken;
      console.log('✅ Got demo token');
    } else {
      console.log('❌ Could not get demo token. Please set a valid token in TEST_DATA.');
      return;
    }
  }
  
  await testResultByTagsAPI();
}

// Run the test
if (require.main === module) {
  runTest();
}

module.exports = { testResultByTagsAPI, getDemoToken };
