const authRouter = require('express').Router();
const {
  isUserAlreadyExist,
  isPasswordMatch,
  isEmailExist,
} = require('../middleware/users.middleware');
const { authController: auth } = require('../controllers');

authRouter.post(
  '/register',
  [isUserAlreadyExist, isPasswordMatch],
  auth.register
);

authRouter.post('/login', isEmailExist, auth.login);

authRouter.post('/logout', auth.logout);

module.exports = authRouter;
