const AppError = require('./AppError');

/**
 * @param {string} message
 * @param {object} errorDetails
 * @returns {AppError}
 */
const NotFoundError = (message, errorDetails) => {
  return new AppError(message, 404, errorDetails);
};

module.exports = { AppError, NotFoundError };
