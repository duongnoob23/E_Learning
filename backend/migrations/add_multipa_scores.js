'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns to speaking_responses table
    await queryInterface.addColumn('speaking_responses', 'pronunciation_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: 'Pronunciation score (0-100)'
    });

    await queryInterface.addColumn('speaking_responses', 'fluency_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: 'Fluency score (0-100) - from MultiPA'
    });

    await queryInterface.addColumn('speaking_responses', 'prosody_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: 'Prosody score (0-100) - from MultiPA'
    });

    await queryInterface.addColumn('speaking_responses', 'transcript', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'MultiPA transcription result'
    });

    await queryInterface.addColumn('speaking_responses', 'grammar_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: 'Grammar score (0-100)'
    });

    await queryInterface.addColumn('speaking_responses', 'vocabulary_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: 'Vocabulary score (0-100)'
    });

    await queryInterface.addColumn('speaking_responses', 'coherence_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: 'Coherence/Organization score (0-100)'
    });

    await queryInterface.addColumn('speaking_responses', 'detailed_feedback', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Detailed feedback for each criterion'
    });

    // Add columns to writing_responses table
    await queryInterface.addColumn('writing_responses', 'task_completion_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: 'Task completion score (0-100)'
    });

    await queryInterface.addColumn('writing_responses', 'spelling_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: 'Spelling score (0-100)'
    });

    await queryInterface.addColumn('writing_responses', 'detailed_feedback', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Detailed feedback for each criterion'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns from speaking_responses table
    await queryInterface.removeColumn('speaking_responses', 'pronunciation_score');
    await queryInterface.removeColumn('speaking_responses', 'fluency_score');
    await queryInterface.removeColumn('speaking_responses', 'prosody_score');
    await queryInterface.removeColumn('speaking_responses', 'transcript');
    await queryInterface.removeColumn('speaking_responses', 'grammar_score');
    await queryInterface.removeColumn('speaking_responses', 'vocabulary_score');
    await queryInterface.removeColumn('speaking_responses', 'coherence_score');
    await queryInterface.removeColumn('speaking_responses', 'detailed_feedback');

    // Remove columns from writing_responses table
    await queryInterface.removeColumn('writing_responses', 'task_completion_score');
    await queryInterface.removeColumn('writing_responses', 'spelling_score');
    await queryInterface.removeColumn('writing_responses', 'detailed_feedback');
  }
};

