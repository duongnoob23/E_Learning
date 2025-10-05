module.exports = (sequence, DataTypes) => { 
    const Passages = sequence.define(
        "Passages",
        {
            passage_id:{
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            part_id: { type: DataTypes.BIGINT, allowNull: false },
            text: { type: DataTypes.TEXT, allowNull: true },
            audio_url: { type: DataTypes.STRING(255), allowNull: true },
            image_url: { type: DataTypes.STRING(255), allowNull: true },
        },
        {tableName : "passages", timestamps: true}
    );

    Passages.findById = async (passage_id) => Passages.findOne({where: { passage_id }});
    Passages.findAll = async () => Passages.findAll();
    Passages.createPassages = async (data) => Passages.create(data);
    Passages.updatePassages = async (passage_id, data) => Passages.upadte(data, {where : {passage_id}});
    return Passages;

}
    