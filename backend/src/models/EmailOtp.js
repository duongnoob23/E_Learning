module.exports = (sequelize, DataTypes) => {
    const EmailOtp = sequelize.define("EmailOtp",{
        email_otp_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING(100), allowNull: false },
        otp: { type: DataTypes.STRING(6), allowNull: false },
        expires_at: { type: DataTypes.DATE, allowNull: false }
    }, {
        tableName: "email_otps",
        timestamps: false
    });

    // Đổi tên hàm tiện ích, KHÔNG ghi đè findOne!
    EmailOtp.findByEmailAndOtp = async (email, otp) => EmailOtp.findOne({ where: { email, otp } });
    EmailOtp.findByEmail = async (email) => EmailOtp.findOne({ where: { email } });
    EmailOtp.findByOtp = async (otp) => EmailOtp.findOne({ where: { otp } });
    EmailOtp.createOtp = async (data) => EmailOtp.create(data);
    EmailOtp.updateOtp = async (email, data) => EmailOtp.update(data, { where: { email } });

    return EmailOtp;
};