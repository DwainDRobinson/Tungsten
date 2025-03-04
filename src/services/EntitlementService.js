'use strict';

exports.checkPermissions = (requiredPermissions, userPermissions) =>
  requiredPermissions.every(permission => userPermissions.includes(permission));
