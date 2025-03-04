'use strict';

import express from 'express';
import { StatusController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  statusIdParamValidation,
  statusPostValidation,
  statusQueryValidation,
  statusUpdateValidation
} from '../validations/statuses';

const { Router } = express;
const router = Router();

router.get(
  '/getStatuses',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  statusQueryValidation,
  validationHandler,
  StatusController.getStatuses
);

router.get(
  '/getStatus/:statusId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  statusIdParamValidation,
  validationHandler,
  StatusController.getStatus
);

router.post(
  '/createStatus',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  statusPostValidation,
  validationHandler,
  StatusController.createStatus
);

router.put(
  '/updateStatus/:statusId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  statusUpdateValidation,
  validationHandler,
  StatusController.updateStatus
);

router.delete(
  '/deleteStatus/:statusId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  statusIdParamValidation,
  validationHandler,
  StatusController.deleteStatus
);

export default router;
