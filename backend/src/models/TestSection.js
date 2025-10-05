module.exports = (sequelize, DataTypes) => {
  const TestSection = sequelize.define('TestSection', {
    section_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tests',
        key: 'test_id'
      }
    },
    section_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    section_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in minutes
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'test_sections',
    timestamps: false,
    hooks: {
      beforeUpdate: (testSection) => {
        testSection.updated_at = new Date();
      }
    }
  });

  // Utility methods
  TestSection.findById = async (section_id) => TestSection.findByPk(section_id);
  TestSection.findByTestId = async (test_id) => TestSection.findAll({ 
    where: { test_id },
    order: [['section_order', 'ASC']]
  });
  TestSection.createSection = async (data) => TestSection.create(data);
  TestSection.updateSection = async (section_id, data) => TestSection.update(data, { where: { section_id } });
  TestSection.deleteSection = async (section_id) => TestSection.destroy({ where: { section_id } });
  TestSection.getSectionsByTest = async (test_id) => {
    return TestSection.findAll({
      where: { test_id },
      order: [['section_order', 'ASC']]
    });
  };

  return TestSection;
};
