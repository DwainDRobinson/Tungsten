'use strict';

const checkPermissions = (requiredPermissions, userPermissions) => {
  try {
    return requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
  } catch (err) {
    logger.error(`Error checking permissions: ${err.message}`);
    return false;
  }
};

export { checkPermissions };
