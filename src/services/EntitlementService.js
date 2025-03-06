'use strict';

const checkPermissions = (requiredPermissions, userPermissions) => {
  return requiredPermissions.every(permission =>
    userPermissions.includes(permission)
  );
};

export { checkPermissions };
