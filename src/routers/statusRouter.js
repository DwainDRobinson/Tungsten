'use strict';

import express from 'express';
import { StatusController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import { isProductionEnvironment } from '../utilities/boolean';
import {
  statusIdParamValidation,
  statusPostValidation,
  statusQueryValidation,
  statusUpdateValidation
} from '../validations/statuses';

const { Router } = express;
const router = Router();

if (isProductionEnvironment()) {
  router.use(rateLimiter);
}

router.get(
  '/getStatuses',
  statusQueryValidation,
  validationHandler,
  StatusController.getStatuses
);

router.get(
  '/getStatus/:statusId',
  statusIdParamValidation,
  validationHandler,
  StatusController.getStatus
);

router.post(
  '/createStatus',
  statusPostValidation,
  validationHandler,
  StatusController.createStatus
);

router.put(
  '/updateStatus/:statusId',
  statusUpdateValidation,
  validationHandler,
  StatusController.updateStatus
);

router.delete(
  '/deleteStatus/:statusId',
  statusIdParamValidation,
  validationHandler,
  StatusController.deleteStatus
);

export default router;
