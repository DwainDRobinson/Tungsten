'use strict';

import { PERMISSIONS } from '../constants';
import logger from '../logger';
import models from '../models';

const roles = [
  {
    name: 'System Admin',
    value: 'SYSTEM_ADMIN',
    description: 'System Admin Role',
    permissions: [
      PERMISSIONS.SYSTEM_ADMIN,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.PROFILE_CREATE,
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.PROFILE_DELETE,
      PERMISSIONS.TASK_CREATE,
      PERMISSIONS.TASK_VIEW,
      PERMISSIONS.TASK_UPDATE,
      PERMISSIONS.TASK_DELETE
    ]
  },
  {
    name: 'Parent',
    value: 'PARENT',
    description: 'Parent Role',
    permissions: [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.PROFILE_CREATE,
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.TASK_CREATE,
      PERMISSIONS.TASK_VIEW,
      PERMISSIONS.TASK_UPDATE,
      PERMISSIONS.TASK_DELETE
    ]
  },
  {
    name: 'Guardian',
    value: 'GUARDIAN',
    description: 'Guardian Role',
    permissions: [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.PROFILE_CREATE,
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.TASK_CREATE,
      PERMISSIONS.TASK_VIEW,
      PERMISSIONS.TASK_UPDATE,
      PERMISSIONS.TASK_DELETE
    ]
  },
  {
    name: 'Provider',
    value: 'PROVIDER',
    description: 'Provider Role',
    permissions: [
      PERMISSIONS.TASK_CREATE,
      PERMISSIONS.TASK_VIEW,
      PERMISSIONS.TASK_UPDATE,
      PERMISSIONS.TASK_DELETE
    ]
  },
  {
    name: 'Director',
    value: 'DIRECTOR',
    description: 'Director Role',
    permissions: [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.PROFILE_CREATE,
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.PROFILE_DELETE
    ]
  },
  {
    name: 'Child',
    value: 'CHILD',
    description: 'Child Role',
    permissions: [
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.TASK_VIEW
    ]
  }
];

const seedRoles = async () => {
  const { Role } = models;
  try {
    const count = await Role.countDocuments();

    if (count > 0) {
      return;
    }

    roles.forEach(role => {
      const newRole = new Role(role);
      newRole.save();
    });
  } catch (err) {
    logger.error(`Error seeding role data into db: ${err.message}`);
    throw err;
  }
};

export { roles };
export default seedRoles;
