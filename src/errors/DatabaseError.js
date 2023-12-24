/**
 * Database Error class
 * @class DatabaseError
 */
class DatabaseError extends Error {
  /**
   * @param {string} message - Error message
   * @param {Error} error - Error object
   */
  constructor(message, error) {
    super(message);
    this.name = 'DatabaseError';
    this.error = error;
  }
}

module.exports = DatabaseError;
