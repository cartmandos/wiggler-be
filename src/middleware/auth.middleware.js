const authHelpers = require('../utils/auth-helpers');
const permissions = require('../utils/policy');
const HttpStatus = require('../utils/http-status');
const {AppError} = require('../errors');

const auth = async (req, res, next) => {
  try {
    const token = authHelpers.getToken(req);
    const decodedToken = authHelpers.verifyToken(token);

    res.locals.user = { uid: decodedToken.uid, role: decodedToken.role };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(HttpStatus.UNAUTHORIZED).send({
        status: HttpStatus.UNAUTHORIZED,
        message: HttpStatus.reason[HttpStatus.UNAUTHORIZED],
      });
    } else {
      next(error);
    }
  }
};

const handleMeParam = (req, res, next) => {
  const { id } = req.params;
  const { user } = res.locals;

  id === 'me' && (req.params.id = user.uid);

  next();
};

const checkPermissions = (req, res, next) => {
  try {
    const { method, params, route } = req;
    const { role, uid } = res.locals.user;

    const path =
      params.id === uid ? route.path.replace('/:id', '/me') : route.path;

    const rolePermissions = permissions(role);
    const isAllowedPath = Object.keys(rolePermissions).includes(path);
    const isAllowedMethod =
      isAllowedPath && rolePermissions[path].includes(method);

    if (!isAllowedPath || !isAllowedMethod) {
      throw new AppError('Access denied.', HttpStatus.FORBIDDEN);
    }

    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  const { user } = res.locals;
  try {
    // TODO: double-check if user is admin
    if (!user || user.role !== 'admin') {
      throw new AppError('Access denied.', HttpStatus.FORBIDDEN);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { auth, handleMeParam, checkPermissions, isAdmin };
