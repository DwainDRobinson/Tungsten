'use strict';

const checkPermissions = (requiredPermissions, userPermissions) =>
  requiredPermissions.every(permission => userPermissions.includes(permission));

export { checkPermissions };
