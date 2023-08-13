function policy() {
  const _userPermissions = {
    '/me': ['GET', 'DELETE', 'PUT'],
    '/me/profile': ['GET'],
    '/me/saved-pets': ['GET', 'POST'],
    '/me/saved-pets/:petId': ['DELETE'],
    '/me/adoptions': ['GET'],
  };

  const _adminPermissions = {
    ..._userPermissions,
    '/': ['GET', 'PUT', 'DELETE'],
    '/:id': ['GET', 'DELETE', 'PUT'],
    '/:id/profile': ['GET'],
    '/:id/adoptions': ['GET'],
  };

  /**
   * @param {string} role
   * @returns {object} permissions
   */
  const permissions = (role) => {
    switch (role) {
      case 'admin':
        return _adminPermissions;
      case 'user':
        return _userPermissions;
      default:
        return {};
    }
  };

  return permissions;
}

module.exports = policy();
