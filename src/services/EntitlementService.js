'use strict';

import logger from '../logger';

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
