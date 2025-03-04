'use strict';

import express from 'express';
import { DifficultyController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import { isProductionEnvironment } from '../utilities/boolean';
import {
  difficultyIdParamValidation,
  difficultyPostValidation,
  difficultyQueryValidation,
  difficultyUpdateValidation
} from '../validations/difficulties';

const { Router } = express;
const router = Router();

if (isProductionEnvironment()) {
  router.use(rateLimiter);
}

router.get(
  '/getDifficulties',
  difficultyQueryValidation,
  validationHandler,
  DifficultyController.getDifficulties
);

router.get(
  '/getDifficulty/:difficultyId',
  difficultyIdParamValidation,
  validationHandler,
  DifficultyController.getDifficulty
);

router.post(
  '/createDifficulty',
  difficultyPostValidation,
  validationHandler,
  DifficultyController.createDifficulty
);

router.put(
  '/updateDifficulty/:difficultyId',
  difficultyUpdateValidation,
  validationHandler,
  DifficultyController.updateDifficulty
);

router.delete(
  '/deleteDifficulty/:difficultyId',
  difficultyIdParamValidation,
  validationHandler,
  DifficultyController.deleteDifficulty
);

export default router;
