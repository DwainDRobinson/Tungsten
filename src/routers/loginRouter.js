'use strict';

import express from 'express';
import { PERMISSIONS } from '../constants';
import { LoginController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import { userIdParamValidation } from '../validations/users';

const { Router } = express;
const router = Router();

router.get(
  '/getLogins/:userId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.PROFILE_VIEW
  ]),
  userIdParamValidation,
  validationHandler,
  LoginController.getLogins
);

export default router;
