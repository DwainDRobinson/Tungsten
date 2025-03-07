'use strict';

import express from 'express';
import { PERMISSIONS } from '../constants';
import { TagController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  tagIdParamValidation,
  tagPostValidation,
  tagQueryValidation,
  tagUpdateValidation
} from '../validations/tags';

const { Router } = express;
const router = Router();

router.get(
  '/getTags',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  tagQueryValidation,
  validationHandler,
  TagController.getTags
);

router.get(
  '/getTag/:tagId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  tagIdParamValidation,
  validationHandler,
  TagController.getTag
);

router.post(
  '/createTag',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  tagPostValidation,
  validationHandler,
  TagController.createTag
);

router.put(
  '/updateTag/:tagId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  tagUpdateValidation,
  validationHandler,
  TagController.updateTag
);

router.delete(
  '/deleteTag/:tagId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  tagIdParamValidation,
  validationHandler,
  TagController.deleteTag
);

export default router;
