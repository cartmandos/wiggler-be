// x-ms-error-code header, code property in body
// INVALID_FORMAT, REQUIRED, MISSING_FIELD, NOT_ALLOWED, INVALID_FIELD, OUT_OF_RANGE, INVALID_VALUE,
// ALREADY_EXISTS, PERMISSION_DENIED, UNAUTHENTICATED, NOT_FOUND, INTERNAL, NOT_FOUND

const Joi = require('joi');
const { NotFoundError } = require('../errors');

// request param id validator
const isValidUserId = (req, res, next) => {
  try {
    const { id } = req.params;
    const schema = Joi.string().uuid();
    const { error } = schema.validate(id);
    if (error) {
      console.log('Thrower: isValidUserId');
      throw NotFoundError(`User with user id '${id}' does not exist`, {
        field: 'id',
        id,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isValidUserId };
