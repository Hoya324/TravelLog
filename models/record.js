const Sequelize = require("sequelize");

module.exports = class Record extends Sequelize.Model {
	// 기록지 테이블
	static init(sequelize) {
		return super.init(
			{
				content: {
					// 기록지 content
					type: Sequelize.STRING(255),
					allowNull: true,
				},
				with: {
					// 함께한 사람
					type: Sequelize.STRING(1000),
					allowNull: true,
				},
				userId: {
					// User ID
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'users',
						key: 'id',
					},
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
				},
				travelId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'travel', // refers to table name
						key: 'id',
					},
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
				},
			},
			{
				sequelize,
				timestamps: true,
				underscored: true,
				modelName: "Record",
				tableName: "record",
				paranoid: true,
				charset: "utf8",
				collate: "utf8_general_ci",
			}
		);
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'userId' });
		this.belongsTo(models.Travel, { foreignKey: 'travelId' });
	}
};