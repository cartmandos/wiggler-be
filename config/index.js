const dotenv = require('dotenv');
const path = require('path');

if (!process.env.HOST) {
  dotenv.config({
    path: path.join(__dirname, '..', '.env'),
  });
}

const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || 'development',
};

module.exports = config;