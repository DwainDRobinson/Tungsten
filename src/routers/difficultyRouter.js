'use strict';

import express from 'express';
import { PERMISSIONS } from '../constants';
import { DifficultyController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  difficultyIdParamValidation,
  difficultyPostValidation,
  difficultyQueryValidation,
  difficultyUpdateValidation
} from '../validations/difficulties';

const { Router } = express;
const router = Router();

router.get(
  '/getDifficulties',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  difficultyQueryValidation,
  validationHandler,
  DifficultyController.getDifficulties
);

router.get(
  '/getDifficulty/:difficultyId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  difficultyIdParamValidation,
  validationHandler,
  DifficultyController.getDifficulty
);

router.post(
  '/createDifficulty',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  difficultyPostValidation,
  validationHandler,
  DifficultyController.createDifficulty
);

router.put(
  '/updateDifficulty/:difficultyId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  difficultyUpdateValidation,
  validationHandler,
  DifficultyController.updateDifficulty
);

router.delete(
  '/deleteDifficulty/:difficultyId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  difficultyIdParamValidation,
  validationHandler,
  DifficultyController.deleteDifficulty
);

export default router;
