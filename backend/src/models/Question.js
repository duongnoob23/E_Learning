module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'test_sections',
        key: 'section_id'
      }
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question_type: {
      type: DataTypes.ENUM('mcq', 'fill_blank', 'short_answer', 'writing', 'speaking'),
      allowNull: false
    },
    order_in_section: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    media_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'questions',
    timestamps: false,
    indexes: [
      {
        fields: ['section_id']
      },
      {
        fields: ['question_type']
      },
      {
        fields: ['section_id', 'order_in_section']
      }
    ]
  });

  // Utility methods
  Question.findBySection = async (sectionId) => {
    return Question.findAll({
      where: { section_id: sectionId },
      order: [['order_in_section', 'ASC']]
    });
  };

  Question.findBySections = async (sectionIds) => {
    return Question.findAll({
      where: { section_id: sectionIds },
      order: [['section_id', 'ASC'], ['order_in_section', 'ASC']]
    });
  };

  Question.findById = async (questionId) => {
    return Question.findByPk(questionId);
  };

  Question.createQuestion = async (data) => {
    return Question.create(data);
  };

  Question.updateQuestion = async (questionId, data) => {
    return Question.update(data, { where: { question_id: questionId } });
  };

  Question.deleteQuestion = async (questionId) => {
    return Question.destroy({ where: { question_id: questionId } });
  };

  return Question;
};
