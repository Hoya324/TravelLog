const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  // 회원 테이블
  static init(sequelize) {
    return super.init(
      {
        nickname: {
          // 이름
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        email: {
          // 이메일
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        password: {
          // 비밀번호
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        provider: {
          // 회원 유형 - local / kakao
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: "local",
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Record, { foreignKey: 'userId' });
  }
};