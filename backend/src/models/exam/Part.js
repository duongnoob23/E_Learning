const { Op } = require("sequelize");
module.exports = (sequence, DataTypes) => {
    const Part = sequence.define(
        "Part", {
            part_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            test_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            part_number: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        }, {
            tableName: "parts",
            timestamps: true
        }
    );

    Part.findById = async (part_id) => Part.findOne({
        where: {
            part_id
        }
    });
    Part.findAll = async () => Part.findAll();
    Part.findAllAndPQ = async (test_id, selectedParts) => {
        return Part.findAll({
            where: {
            test_id,
            part_id: {
                [Op.in]: selectedParts,
            },
            },
            include: [
                {
                model: Passages,
                as: "passages",
                include: [
                    {
                    model: Questions,
                    as: "questions"
                    }
                ]
                },
            ],
        });
    };

    Part.findByTest = async (test_id) => Part.findAll({ where: { test_id} });
    Part.findByTestIdAndParts = async (test_id, partNumbers) => {
        return Part.findAll({
            where: {
                test_id,
                part_number: {
                    [Op.in]: partNumbers, 
                },
            },
        });
    };
    Part.createPart = async (data) => Part.create(data);
    Part.updatePart = async (part_id, data) => Part.upadte(data, {
        where: {
            part_id
        }
    });
    return Part;

}

