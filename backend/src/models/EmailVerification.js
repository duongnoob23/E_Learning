module.exports = (sequelize, DataTypes) => {
  const EmailVerification = sequelize.define("EmailVerification", {
    verification_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      allowNull: false
    },
    email: { type: DataTypes.STRING(100), allowNull: false },
    verification_token: { type: DataTypes.STRING(255), allowNull: false },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verified_at: { type: DataTypes.DATE },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "email_verifications",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Hàm tiện ích
  EmailVerification.findById = async (verification_id) => 
    EmailVerification.findOne({ where: { verification_id } });

  EmailVerification.findByEmail = async (email) => 
    EmailVerification.findOne({ where: { email } });

  EmailVerification.findByToken = async (verification_token) => 
    EmailVerification.findOne({ where: { verification_token } });

  EmailVerification.findByUserId = async (user_id) => 
    EmailVerification.findAll({ where: { user_id } });

  EmailVerification.createVerification = async (data) => 
    EmailVerification.create(data);

  EmailVerification.updateVerification = async (verification_id, data) => 
    EmailVerification.update(data, { where: { verification_id } });

  EmailVerification.deleteVerification = async (verification_id) => 
    EmailVerification.destroy({ where: { verification_id } });

  // Tìm verification hợp lệ (chưa xác thực và chưa hết hạn)
  EmailVerification.findValidVerification = async (email, verification_token) => {
    const { Op } = require('sequelize');
    return EmailVerification.findOne({ 
      where: { 
        email, 
        verification_token,
        is_verified: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      } 
    });
  };

  // Đánh dấu đã xác thực
  EmailVerification.markAsVerified = async (verification_id) => 
    EmailVerification.update(
      { 
        is_verified: true, 
        verified_at: new Date() 
      }, 
      { where: { verification_id } }
    );

  // Xóa các verification đã hết hạn
  EmailVerification.cleanupExpired = async () => {
    const { Op } = require('sequelize');
    return EmailVerification.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date()
        }
      }
    });
  };

  // Kiểm tra email đã được xác thực chưa
  EmailVerification.isEmailVerified = async (email) => {
    const verification = await EmailVerification.findOne({
      where: { email, is_verified: true }
    });
    return !!verification;
  };

  return EmailVerification;
};
