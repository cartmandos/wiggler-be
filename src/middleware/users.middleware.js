const { UserService } = require('../services');

const isUserAlreadyExist = async (req, res, next) => {
  const { email } = req.body;
  try {
    const isEmailExists = await UserService.findOneByField('email', email);
    if (isEmailExists) {
      return res.status(409).send({ message: 'Email already exists' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const isEmailExist = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await UserService.findOneByField('email', email);
    console.log(user);
    if (user) {
      req.body.user = user;
      return next();
    }
    return res.status(401).send({
      message: 'Login failed. Invalid email or password.',
    });
  } catch (error) {
    next(error);
  }
};

const isPasswordMatch = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send({ message: 'Passwords do not match' });
  }
  next();
};

module.exports = {
  isUserAlreadyExist,
  isEmailExist,
  isPasswordMatch,
};
