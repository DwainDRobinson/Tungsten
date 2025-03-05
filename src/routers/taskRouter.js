'use strict';

import express from 'express';
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
  hasPermissionHandler(['SYSTEM_ADMIN']),
  taskQueryValidation,
  validationHandler,
  TaskController.getTasks
);

router.get(
  '/getTask/:taskId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  taskIdParamValidation,
  validationHandler,
  TaskController.getTask
);

router.post(
  '/createTask',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  taskPostValidation,
  validationHandler,
  TaskController.createTask
);

router.put(
  '/updateTask/:taskId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  taskUpdateValidation,
  validationHandler,
  TaskController.updateTask
);

router.delete(
  '/deleteTask/:taskId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  taskIdParamValidation,
  validationHandler,
  TaskController.deleteTask
);

export default router;
