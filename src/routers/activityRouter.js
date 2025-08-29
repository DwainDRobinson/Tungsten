'use strict';

import express from 'express';
import { PERMISSIONS } from '../constants';
import { ActivityController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  activityIdParamValidation,
  activityPostValidation,
  activityQueryValidation,
  activityUpdateValidation
} from '../validations/activities';

const { Router } = express;
const router = Router();

router.get(
  '/getActivities',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.ACTIVITY_VIEW]),
  activityQueryValidation,
  validationHandler,
  ActivityController.getActivities
);

router.get(
  '/getActivity/:activityId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.ACTIVITY_VIEW]),
  activityIdParamValidation,
  validationHandler,
  ActivityController.getActivity
);

router.post(
  '/createActivity',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.ACTIVITY_CREATE]),
  activityPostValidation,
  validationHandler,
  ActivityController.createActivity
);

router.put(
  '/updateActivity/:activityId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.ACTIVITY_UPDATE]),
  activityUpdateValidation,
  validationHandler,
  ActivityController.updateActivity
);

router.delete(
  '/deleteActivity/:activityId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  activityIdParamValidation,
  validationHandler,
  ActivityController.deleteActivity
);

export default router;
