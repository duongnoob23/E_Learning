'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Check if columns already exist
      const tableDescription = await queryInterface.describeTable('writing_responses', { transaction });
      
      const columnsToAdd = [];
      
      if (!tableDescription.task_completion_score) {
        columnsToAdd.push(
          queryInterface.addColumn('writing_responses', 'task_completion_score', {
            type: Sequelize.FLOAT,
            allowNull: true,
            comment: 'Task completion score (0-100)'
          }, { transaction })
        );
      }
      
      if (!tableDescription.spelling_score) {
        columnsToAdd.push(
          queryInterface.addColumn('writing_responses', 'spelling_score', {
            type: Sequelize.FLOAT,
            allowNull: true,
            comment: 'Spelling score (0-100)'
          }, { transaction })
        );
      }
      
      if (!tableDescription.detailed_feedback) {
        columnsToAdd.push(
          queryInterface.addColumn('writing_responses', 'detailed_feedback', {
            type: Sequelize.JSON,
            allowNull: true,
            comment: 'Detailed feedback for each criterion'
          }, { transaction })
        );
      }
      
      if (columnsToAdd.length > 0) {
        await Promise.all(columnsToAdd);
        console.log(`✅ Added ${columnsToAdd.length} columns to writing_responses`);
      } else {
        console.log('✅ All columns already exist in writing_responses');
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const tableDescription = await queryInterface.describeTable('writing_responses', { transaction });
      
      const columnsToRemove = [];
      
      if (tableDescription.task_completion_score) {
        columnsToRemove.push(
          queryInterface.removeColumn('writing_responses', 'task_completion_score', { transaction })
        );
      }
      
      if (tableDescription.spelling_score) {
        columnsToRemove.push(
          queryInterface.removeColumn('writing_responses', 'spelling_score', { transaction })
        );
      }
      
      if (tableDescription.detailed_feedback) {
        columnsToRemove.push(
          queryInterface.removeColumn('writing_responses', 'detailed_feedback', { transaction })
        );
      }
      
      if (columnsToRemove.length > 0) {
        await Promise.all(columnsToRemove);
        console.log(`✅ Removed ${columnsToRemove.length} columns from writing_responses`);
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

