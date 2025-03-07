'use strict';

import express from 'express';
import { PERMISSIONS } from '../constants';
import { CategoryController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  categoryIdParamValidation,
  categoryPostValidation,
  categoryQueryValidation,
  categoryUpdateValidation
} from '../validations/categories';

const { Router } = express;
const router = Router();

router.get(
  '/getCategories',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  categoryQueryValidation,
  validationHandler,
  CategoryController.getCategories
);

router.get(
  '/getCategory/:categoryId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  categoryIdParamValidation,
  validationHandler,
  CategoryController.getCategory
);

router.post(
  '/createCategory',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  categoryPostValidation,
  validationHandler,
  CategoryController.createCategory
);

router.put(
  '/updateCategory/:categoryId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  categoryUpdateValidation,
  validationHandler,
  CategoryController.updateCategory
);

router.delete(
  '/deleteCategory/:categoryId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler([PERMISSIONS.SYSTEM_ADMIN]),
  categoryIdParamValidation,
  validationHandler,
  CategoryController.deleteCategory
);

export default router;
