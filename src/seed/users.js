'use strict';

import config from '../config';
import { PERMISSIONS, ROLES } from '../constants';
import logger from '../logger';
import models from '../models';

const { USER_PASS } = config.auth;

const users = [
  {
    email: 'admin@puzzleperks.com',
    password: USER_PASS,
    firstName: 'Alice',
    lastName: 'Admin',
    role: ROLES.ADMIN,
    permissions: [
      PERMISSIONS.SYSTEM_ADMIN,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.PROFILE_CREATE,
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.PROFILE_DELETE,
      PERMISSIONS.ACTIVITY_CREATE,
      PERMISSIONS.ACTIVITY_VIEW,
      PERMISSIONS.ACTIVITY_UPDATE,
      PERMISSIONS.ACTIVITY_DELETE
    ],
    dob: '1980-05-15',
    gender: 'M',
    city: 'Chicago',
    state: 'IL',
    zipCode: '10001'
  },
  {
    email: 'parent@puzzleperks.com',
    password: USER_PASS,
    firstName: 'Bob',
    lastName: 'Parent',
    role: ROLES.PARENT,
    permissions: [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.PROFILE_CREATE,
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.ACTIVITY_CREATE,
      PERMISSIONS.ACTIVITY_VIEW,
      PERMISSIONS.ACTIVITY_UPDATE,
      PERMISSIONS.ACTIVITY_DELETE
    ],
    points: 0,
    dob: '1985-07-10',
    gender: 'M',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001'
  },
  {
    email: 'guardian@puzzleperks.com',
    password: USER_PASS,
    firstName: 'Carol',
    lastName: 'Guardian',
    role: ROLES.GUARDIAN,
    permissions: [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.PROFILE_CREATE,
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.ACTIVITY_CREATE,
      PERMISSIONS.ACTIVITY_VIEW,
      PERMISSIONS.ACTIVITY_UPDATE,
      PERMISSIONS.ACTIVITY_DELETE
    ],
    points: 0,
    dob: '1978-09-20',
    gender: 'F',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601'
  },
  {
    email: 'provider@puzzleperks.com',
    password: USER_PASS,
    firstName: 'David',
    lastName: 'Provider',
    role: ROLES.PROVIDER,
    permissions: [
      PERMISSIONS.ACTIVITY_CREATE,
      PERMISSIONS.ACTIVITY_VIEW,
      PERMISSIONS.ACTIVITY_UPDATE,
      PERMISSIONS.ACTIVITY_DELETE
    ],
    dob: '1990-03-12',
    gender: 'M',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001'
  },
  {
    email: 'director@puzzleperks.com',
    password: USER_PASS,
    firstName: 'Eve',
    lastName: 'Director',
    role: ROLES.DIRECTOR,
    permissions: [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.PROFILE_CREATE,
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.PROFILE_DELETE
    ],
    dob: '1975-12-05',
    gender: 'F',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101'
  },
  {
    email: 'child@puzzleperks.com',
    password: USER_PASS,
    firstName: 'Frank',
    lastName: 'Child',
    role: ROLES.CHILD,
    permissions: [
      PERMISSIONS.PROFILE_VIEW,
      PERMISSIONS.PROFILE_UPDATE,
      PERMISSIONS.ACTIVITY_VIEW
    ],
    careGivers: [],
    points: 0,
    dob: '2015-06-22',
    gender: 'M',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94101'
  }
];

const seedUsers = async () => {
  const { User } = models;
  try {
    const count = await User.countDocuments();

    if (count > 0) {
      return;
    }

    await User.insertMany(users);
  } catch (err) {
    logger.error(`Error seeding data into db: ${err.message}`);
    throw err;
  }
};

export { users };
export default seedUsers;
