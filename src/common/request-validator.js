const Joi = require('joi');

// request validator middleware factory
const requestValidator = {
  login: (req, res, next) => {
    validateRequest(validationSchemes.login(req.body));
    next();
  },
};

const validateRequest = (schema) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const validationErrors = error.details.map((detail) => detail.message);
    return res.error('Validation error', 400, validationErrors);
  }
};

const validationSchemes = {
  login: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
      uid: Joi.string().uu,
    });
    return schema.validate(data, { abortEarly: false });
  },
};

module.exports = {
  validateRequest,
  requestValidator,
};
