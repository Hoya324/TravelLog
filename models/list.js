const Sequelize = require("sequelize");

module.exports = class List extends Sequelize.Model {
  // 여행지 리스트 테이블
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 고유 ID
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
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
        modelName: "List",
        tableName: "list",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.User, { through: 'user_travel' });
    this.belongsToMany(models.Travel, { through: 'user_travel' });
  }
};
