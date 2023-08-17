const HttpStatus = require('../utils/http-status');
const { env } = require('../config');
const { AppError } = require('../errors');
const { ulid } = require('ulidx');

const errorHandler = (options = { logging: false }) => {
  const { logging } = options;

  return (err, req, res, next) => {
    let errors;
    let code = HttpStatus.BAD_REQUEST;

    if (err instanceof AppError) {
      err.code && (code = err.code);
      errors = { code, ...err.errorDetails };
    } else if (err.cause instanceof AppError) {
      const { cause } = err;
      cause.code && (code = cause.code);
      errors = { code, message: cause.message, ...cause.errorDetails };
    } else {
      //const { cause } = err;
      code = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

      // exposing error details to response json
      // cause && (errors = logging ? cause : cause?.message.replace(/"/g, ''));

      // logging && handleInternalError(err);
      //errors = { code: code, message: HttpStatus.reason[code] };
    }
    const message =
      code === HttpStatus.INTERNAL_SERVER_ERROR
        ? {
            status: code,
            message: 'Unexpected error. Please try again later.',
            detail: HttpStatus.reason[code],
          }
        : err.message || HttpStatus.reason[code];

    res.status(code).send({
      message,
      errors,
    });

    logging && console.log('ERR', `\x1b[33m${err.message}\x1b[0m`, `\x1b[31m${err.name}\x1b[0m`);
    //
    //logging && console.log('ERR', err);
    next();
  };
};

const handleInternalError = (err) => {
  //const errorId = ulid();
  //console.log('ErrorId', errorId);
  if (err.cause && err.cause.name && err.cause.name.startsWith('Sequelize')) {
    //'SequelizeDatabaseError', 'SequelizeValidationError', 'SequelizeUniqueConstraintError'
    console.log('DB ERR', err.cause.message, err.cause.parent.detail, err.cause.name);
  }
  if (err instanceof SyntaxError) {
    console.log('SYNTAXERROR', err.message);
  }
  if (err instanceof TypeError) {
    console.log('TYPEERROR', err.message);
  }

  // return isInternal;
};

module.exports = { errorHandler };
