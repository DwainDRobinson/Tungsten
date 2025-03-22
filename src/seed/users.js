'use strict';

import { PERMISSIONS, ROLES } from '../constants';
import logger from '../logger';
import models from '../models';

const seedUsers = async () => {
  const { User } = models;
  try {
    const users = [
      {
        email: 'admin@puzzleperks.com',
        password: 'hashedpassword',
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
          PERMISSIONS.TASK_CREATE,
          PERMISSIONS.TASK_VIEW,
          PERMISSIONS.TASK_UPDATE,
          PERMISSIONS.TASK_DELETE
        ],
        points: 0,
        dob: '1980-05-15',
        gender: 'M',
        city: 'Chicago',
        state: 'IL',
        zipCode: '10001'
      },
      {
        email: 'parent@puzzleperks.com',
        password: 'hashedpassword',
        firstName: 'Bob',
        lastName: 'Parent',
        role: ROLES.PARENT,
        permissions: [
          PERMISSIONS.MANAGE_USERS,
          PERMISSIONS.PROFILE_CREATE,
          PERMISSIONS.PROFILE_VIEW,
          PERMISSIONS.PROFILE_UPDATE,
          PERMISSIONS.TASK_CREATE,
          PERMISSIONS.TASK_VIEW,
          PERMISSIONS.TASK_UPDATE,
          PERMISSIONS.TASK_DELETE
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
        password: 'hashedpassword',
        firstName: 'Carol',
        lastName: 'Guardian',
        role: ROLES.GUARDIAN,
        permissions: [
          PERMISSIONS.MANAGE_USERS,
          PERMISSIONS.PROFILE_CREATE,
          PERMISSIONS.PROFILE_VIEW,
          PERMISSIONS.PROFILE_UPDATE,
          PERMISSIONS.TASK_CREATE,
          PERMISSIONS.TASK_VIEW,
          PERMISSIONS.TASK_UPDATE,
          PERMISSIONS.TASK_DELETE
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
        password: 'hashedpassword',
        firstName: 'David',
        lastName: 'Provider',
        role: ROLES.PROVIDER,
        permissions: [
          PERMISSIONS.TASK_CREATE,
          PERMISSIONS.TASK_VIEW,
          PERMISSIONS.TASK_UPDATE,
          PERMISSIONS.TASK_DELETE
        ],
        points: 0,
        dob: '1990-03-12',
        gender: 'M',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001'
      },
      {
        email: 'director@puzzleperks.com',
        password: 'hashedpassword',
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
        points: 0,
        dob: '1975-12-05',
        gender: 'F',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101'
      },
      {
        email: 'child@puzzleperks.com',
        password: 'hashedpassword',
        firstName: 'Frank',
        lastName: 'Child',
        role: ROLES.CHILD,
        permissions: [
          PERMISSIONS.PROFILE_VIEW,
          PERMISSIONS.PROFILE_UPDATE,
          PERMISSIONS.TASK_VIEW
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

    users.forEach(user => {
      const newUser = new User(user);
      newUser.save();
    });
  } catch (err) {
    logger.error(`Error seeding data into db: ${err.message}`);
    throw err;
  }
};

export default seedUsers;
