'use strict';

import express from 'express';
import { PERMISSIONS } from '../constants';
import { UserController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  userCreationValidation,
  userIdParamValidation,
  userQueryValidation,
  userUpdateValidation
} from '../validations/users';

const { Router } = express;
const router = Router();

router.get(
  '/getUsers',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.MANAGE_USERS]),
  userQueryValidation,
  validationHandler,
  UserController.getUsers
);

router.get(
  '/getUser/:userId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.PROFILE_VIEW
  ]),
  userIdParamValidation,
  validationHandler,
  UserController.getUser
);

router.post(
  '/createUser',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.PROFILE_CREATE
  ]),
  userCreationValidation,
  validationHandler,
  UserController.createUser
);

router.put(
  '/updateUser/:userId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.PROFILE_UPDATE
  ]),
  userUpdateValidation,
  validationHandler,
  UserController.updateUser
);

router.delete(
  '/deleteUser/:userId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.PROFILE_DELETE
  ]),
  userIdParamValidation,
  validationHandler,
  UserController.deleteUser
);

export default router;
