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
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.TASK_VIEW]),
  taskQueryValidation,
  validationHandler,
  TaskController.getTasks
);

router.get(
  '/getTask/:taskId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.TASK_VIEW]),
  taskIdParamValidation,
  validationHandler,
  TaskController.getTask
);

router.post(
  '/createTask',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.TASK_CREATE]),
  taskPostValidation,
  validationHandler,
  TaskController.createTask
);

router.put(
  '/updateTask/:taskId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN, PERMISSIONS.TASK_UPDATE]),
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
