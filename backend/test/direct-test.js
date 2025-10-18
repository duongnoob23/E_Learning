// Direct test of the Result By Tags API
const examClientService = require('../src/client/services/examClientService');

async function testDirectly() {
  try {
    console.log('🧪 Testing getResultByTags service directly...\n');

    // Test with session_id = 1, user_id = 6 (from our database check)
    const result = await examClientService.getResultByTags(1, 6);
    
    console.log('📊 Service Response:');
    console.log(JSON.stringify(result, null, 2));

    if (result.EC === "0") {
      console.log('\n✅ Test PASSED!');
      
      const { session_info, overall_statistics, tag_analysis } = result.DT;
      
      console.log('\n📈 Summary:');
      console.log(`Session: ${session_info.session_id}, Score: ${session_info.total_score}`);
      console.log(`Overall Accuracy: ${overall_statistics.overall_accuracy}%`);
      console.log(`Total Questions: ${overall_statistics.total_questions}`);
      
      console.log('\n🏷️ Tag Analysis:');
      tag_analysis.forEach((tag, index) => {
        console.log(`${index + 1}. ${tag.tag_name}`);
        console.log(`   📊 ${tag.correct_answers}/${tag.total_questions} correct (${tag.accuracy_rate}%)`);
        console.log(`   📝 Questions: ${tag.question_list.map(q => q.question_number).join(', ')}`);
      });
      
    } else {
      console.log('\n❌ Test FAILED:');
      console.log(`Error: ${result.EM}`);
    }

  } catch (error) {
    console.error('❌ Test Error:', error);
  }
}

// Run the test
testDirectly();
