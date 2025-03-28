'use strict';

import logger from '../logger';
import models from '../models';

const permissions = [
  {
    name: 'System Admin',
    value: 'SYSTEM_ADMIN',
    description: 'System Admin permission'
  },
  {
    name: 'Manage Users',
    value: 'MANAGE_USERS',
    description: 'Manage Users permission'
  },
  {
    name: 'Profile Create',
    value: 'PROFILE_CREATE',
    description: 'Profile Create permission'
  },
  {
    name: 'Profile View',
    value: 'PROFILE_VIEW',
    description: 'Profile View permission'
  },
  {
    name: 'Profile Update',
    value: 'PROFILE_UPDATE',
    description: 'Profile Update permission'
  },
  {
    name: 'Profile Delete',
    value: 'PROFILE_DELETE',
    description: 'Profile Delete permission'
  },
  {
    name: 'Task Create',
    value: 'TASK_CREATE',
    description: 'Task Create permission'
  },
  {
    name: 'Task View',
    value: 'TASK_VIEW',
    description: 'Task View permission'
  },
  {
    name: 'Task Update',
    value: 'TASK_UPDATE',
    description: 'Task Update permission'
  },
  {
    name: 'Task Delete',
    value: 'TASK_DELETE',
    description: 'Task Delete permission'
  }
];

const seedPermissions = async () => {
  const { Permission } = models;
  try {
    const count = await Permission.countDocuments();

    if (count > 0) {
      return;
    }

    permissions.forEach(permission => {
      const newPermission = new Permission(permission);
      newPermission.save();
    });
  } catch (err) {
    logger.error(`Error seeding permission data into db: ${err.message}`);
    throw err;
  }
};

export { permissions };
export default seedPermissions;
