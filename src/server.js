const app = require('./app');
const db = require('./database/db');
const server = require('http').createServer(app);
const dbConnection = require('./database').createConnection(db);
const { host, port } = require('./config');
const { chalk } = require('./utils/core-helpers');

server.on('listening', () => {
  console.log(chalk.green(`[server] Server listening on ${host}:${port}`));
});

server.on('error', (error) => {
  console.error(chalk.red('Server error:'), error);
  throw error;
});

async function startServer() {
  console.log(chalk.green('Starting server...'));
  try {
    await dbConnection.connect();
    server.listen(port, host);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

startServer();
