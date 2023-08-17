const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  jwtConfig: { secret, expiresIn },
} = require('../config').authConfig;
const { AppError } = require('../errors');

async function hashPassword(password) {
  const cost = 10; // ~10 hashes/sec
  try {
    const salt = await bcrypt.genSalt(cost);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Failed to hash password.', { cause: error });
  }
}

async function comparePasswords(password, hashedPassword) {
  try {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    throw new Error('Failed to compare passwords', { cause: error });
  }
}

function createToken(payload) {
  try {
    const token = jwt.sign(payload, secret, {
      expiresIn,
    });
    return token;
  } catch (error) {
    throw new Error('Failed to create token');
  }
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.uid || !decoded.role) {
      throw new Error('Failed to decode token or missing data in payload', {
        cause: { token, decoded },
      });
    }

    return decoded;
  } catch (error) {
    throw new Error('Failed to verify token', { cause: error });
  }
}

function getToken(req, signed = true) {
  const token = signed ? req.signedCookies.access_token : req.cookies.access_token;
  if (!token) {
    throw new AppError('Please login.');
  }
  return token;
}

const authHelpers = {
  hashPassword,
  comparePasswords,
  createToken,
  verifyToken,
  getToken,
};

module.exports = authHelpers;
