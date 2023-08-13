/*
error => message, code, details/target

#1
error details format:
{ message: `error`, field: 'id' }
#2
[
  { code: '100', message: `error one`, field: 'one' },
  { code: '101', message: `error two`, field: 'two' },
] 
#3
{
  errorOne: { code: '100', message: `error one`, field: 'one' },
  errorTwo: { code: '101', message: `error two`, field: 'two' }
} 
 */

/**
 * @param {string} message - error message
 * @param {number} code - http status code
 * @param {object} errorDetails - error details
 * @example throw new AppError('Validation error', 400, { message: `Invalid`, field: 'email' });
 **/
class AppError extends Error {
  constructor(message, code, errorDetails) {
    super(message);
    this.code = code;
    this.errorDetails = errorDetails;
    // error (error type), statusCode (http status code), code (internal error code), details (error details / errors)
  }
}

module.exports = AppError;
