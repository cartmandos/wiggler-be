const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const config = require('./config').appConfig;
const routes = require('./routes');
const { errorHandler } = require('./middleware/error-handler');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(logger(config.loggerOptions));
app.use(cookieParser(config.cookieSecret));
app.use(cors(config.corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(config.apiPath, routes);

app.use(errorHandler(config.errorsOptions));

module.exports = app;
