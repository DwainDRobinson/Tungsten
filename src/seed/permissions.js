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
    name: 'Activity Create',
    value: 'ACTIVITY_CREATE',
    description: 'Activity Create permission'
  },
  {
    name: 'Activity View',
    value: 'ACTIVITY_VIEW',
    description: 'Activity View permission'
  },
  {
    name: 'Activity Update',
    value: 'ACTIVITY_UPDATE',
    description: 'Activity Update permission'
  },
  {
    name: 'Activity Delete',
    value: 'ACTIVITY_DELETE',
    description: 'Activity Delete permission'
  }
];

const seedPermissions = async () => {
  const { Permission } = models;
  try {
    const count = await Permission.countDocuments();

    if (count > 0) {
      return;
    }

    await Permission.insertMany(permissions);
  } catch (err) {
    logger.error(`Error seeding permission data into db: ${err.message}`);
    throw err;
  }
};

export { permissions };
export default seedPermissions;
