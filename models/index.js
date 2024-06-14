"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const env = process.env.NODE_ENV || "development";
const config = require('../config/config.json')[env];
const User = require("./user");
const Travel = require("./travel");
const List = require("./list");
const Record = require("./record");
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Travel = Travel;
db.List = List;
db.Record = Record;

User.init(sequelize);
Travel.init(sequelize);
List.init(sequelize);
Record.init(sequelize);

User.associate(db);
Travel.associate(db);
Record.associate(db);
List.associate(db);

// 회원 : 여행지 = N : M
User.belongsToMany(Travel, {
  through: List,
});
Travel.belongsToMany(User, {
  through: List,
});

module.exports = db;