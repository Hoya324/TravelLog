const Sequelize = require("sequelize");

module.exports = class Travel extends Sequelize.Model {
  // 여행지 테이블
  static init(sequelize) {
    return super.init(
      {
        name: {
          // 여행지 이름
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        address: {
          // 주소
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        phone: {
          // 전화번호
          type: Sequelize.STRING(20),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: "Travel",
        tableName: "travel",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(models) {
    this.hasOne(models.Record, { foreignKey: 'travelId' });
  }
};
