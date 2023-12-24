const { chalk } = require('../utils/core-helpers');
const { DatabaseError } = require('../errors');

function dbConnection(db) {
  const sequelize = db.sequelize;

  const testConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };

  const connect = async (options = { logging: false }, seed = false) => {
    try {
      await sequelize.sync(options);
      console.log(chalk.green(`[database] Connected to database '${db.name}'`));

      if (seed) {
        const { seedMockData } = require('../seeders/mock');
        await seedMockData(db);
      }
    } catch (error) {
      console.error(chalk.red('Unable to connect database:'), error);
      throw new DatabaseError(error);
    }
  };

  return {
    testConnection,
    connect,
  };
}

module.exports = {
  createConnection: (db) => dbConnection(db),
};
