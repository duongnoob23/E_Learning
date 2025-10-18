// Script to check database for testing Result By Tags API
const { sequelize, ExamSession, UserAnswer, Question, ExamTag, QuestionTag } = require('../src/models');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database for test data...\n');

    // Check exam sessions
    const sessions = await ExamSession.findAll({
      where: { status: 'COMPLETED' },
      limit: 5,
      order: [['created_at', 'DESC']]
    });
    
    console.log(`📊 Found ${sessions.length} completed exam sessions:`);
    sessions.forEach(session => {
      console.log(`  - Session ID: ${session.exam_session_id}, User: ${session.user_id}, Test: ${session.test_id}, Score: ${session.total_score}`);
    });

    if (sessions.length > 0) {
      const sessionId = sessions[0].exam_session_id;
      
      // Check user answers for first session
      const answers = await UserAnswer.findAll({
        where: { exam_session_id: sessionId },
        limit: 5
      });
      
      console.log(`\n📝 Found ${answers.length} answers for session ${sessionId}:`);
      answers.forEach(answer => {
        console.log(`  - Question: ${answer.question_id}, Correct: ${answer.is_correct}, Choice: ${answer.selected_choice_id}`);
      });
    }

    // Check exam tags
    const tags = await ExamTag.findAll({ limit: 10 });
    console.log(`\n🏷️ Found ${tags.length} exam tags:`);
    tags.forEach(tag => {
      console.log(`  - ${tag.name}: ${tag.description || 'No description'}`);
    });

    // Check question tags
    const questionTags = await QuestionTag.findAll({ limit: 10 });
    console.log(`\n🔗 Found ${questionTags.length} question-tag relationships:`);
    questionTags.forEach(qt => {
      console.log(`  - Question ${qt.question_id} -> Tag ${qt.exam_tag_id}`);
    });

    // Check questions
    const questions = await Question.findAll({ limit: 5 });
    console.log(`\n❓ Found ${questions.length} questions:`);
    questions.forEach(q => {
      console.log(`  - Question ${q.question_id}: ${q.question_text.substring(0, 50)}...`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the check
checkDatabase();
