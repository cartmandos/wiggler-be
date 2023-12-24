const app = require('./app');
const db = require('./database/db');
const { createServer } = require('node:http');
const { createConnection } = require('./database');
const { host, port, env } = require('./config');
const { chalk } = require('./utils/core-helpers');

const server = createServer(app);
const dbConnection = createConnection(db);

function shutdown(signal) {
  console.info(`[${signal}] Shutting down server...`, new Date().toISOString());
  server.close((err) => {
    if (err) {
      process.exitCode = 1;
    }
    process.exit();
  });
}

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

async function startServer() {
  console.log(chalk.green(`Starting ${env} server...`));
  try {
    await dbConnection.connect();
    server.listen(port, host, () => {
      console.log(chalk.green(`[server] Server listening on ${host}:${port}`));
    });
  } catch (error) {
    console.error(chalk.red('Unable to start server:'), error);
    shutdown(error.name);
  }
}

startServer();
