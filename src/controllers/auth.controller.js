const { UserService } = require('../services');
const authHelpers = require('../utils/auth-helpers');
const { CREATED, UNAUTHORIZED } = require('../utils/http-status');
const { tokenCookieOptions } = require('../config').authConfig;
const { requestValidator } = require('../common/request-validator');

async function register(req, res, next) {
  try {
    const { password } = req.body;
    const hashedPassword = await authHelpers.hashPassword(password);
    await UserService.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(CREATED).send({
      message: 'User registered',
      //redirect
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { user, password } = req.body;

    const isValid = await authHelpers.comparePasswords(password, user.password);
    if (!isValid) {
      return res.status(UNAUTHORIZED).send({
        message: 'Login failed. Invalid email or password.',
      });
    }

    const payload = { uid: user.uid, role: user.Role.name };
    const token = authHelpers.createToken(payload);
    res.cookie('access_token', token, tokenCookieOptions);

    res.send({
      message: 'User logged-in successfully.',
      data: {
        _id: user.uid,
        email: user.email,
        isAdmin: user.Role.name === 'admin',
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie('access_token');
    res.send({
      message: 'User logged-out successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout };
