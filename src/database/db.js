const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { dbConfig } = require('../config');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  ...dbConfig,
});

const db = { name: dbConfig.database };
// load all models
const modelsBaseDir = path.resolve(__dirname, '../models');
fs.readdirSync(modelsBaseDir)
  .filter((file) => {
    return (
      fs.statSync(path.join(modelsBaseDir, file)).isFile() &&
      file.indexOf('.') !== 0 &&
      file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(modelsBaseDir, file))(sequelize);
    db[model.name] = model;
  });

// associate models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
