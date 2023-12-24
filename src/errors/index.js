const AppError = require('./AppError');
const DatabaseError = require('./DatabaseError');

/**
 * @param {string} message
 * @param {object} errorDetails
 * @returns {AppError}
 */
const NotFoundError = (message, errorDetails) => {
  return new AppError(message, 404, errorDetails);
};

module.exports = { AppError, DatabaseError, NotFoundError };
