'use strict';

import express from 'express';
import { PERMISSIONS } from '../constants';
import { TaskController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  taskIdParamValidation,
  taskPostValidation,
  taskQueryValidation,
  taskUpdateValidation
} from '../validations/tasks';

const { Router } = express;
const router = Router();

router.get(
  '/getTasks',
  validateAuthorizationTokenHandler,
  taskQueryValidation,
  validationHandler,
  TaskController.getTasks
);

router.get(
  '/getTask/:taskId',
  validateAuthorizationTokenHandler,
  taskIdParamValidation,
  validationHandler,
  TaskController.getTask
);

router.post(
  '/createTask',
  validateAuthorizationTokenHandler,
  taskPostValidation,
  validationHandler,
  TaskController.createTask
);

router.put(
  '/updateTask/:taskId',
  validateAuthorizationTokenHandler,
  taskUpdateValidation,
  validationHandler,
  TaskController.updateTask
);

router.delete(
  '/deleteTask/:taskId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  taskIdParamValidation,
  validationHandler,
  TaskController.deleteTask
);

export default router;
