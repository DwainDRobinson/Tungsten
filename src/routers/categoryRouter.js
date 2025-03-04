'use strict';

import express from 'express';
import { CategoryController } from '../controllers';
import {
  hasPermissionHandler,
  rateLimiter,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import { isProductionEnvironment } from '../utilities/boolean';
import {
  categoryIdParamValidation,
  categoryPostValidation,
  categoryQueryValidation,
  categoryUpdateValidation
} from '../validations/categories';

const { Router } = express;
const router = Router();

if (isProductionEnvironment()) {
  router.use(rateLimiter);
}

router.get(
  '/getCategories',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  categoryQueryValidation,
  validationHandler,
  CategoryController.getCategories
);

router.get(
  '/getCategory/:categoryId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  categoryIdParamValidation,
  validationHandler,
  CategoryController.getCategory
);

router.post(
  '/createCategory',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  categoryPostValidation,
  validationHandler,
  CategoryController.createCategory
);

router.put(
  '/updateCategory/:categoryId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  categoryUpdateValidation,
  validationHandler,
  CategoryController.updateCategory
);

router.delete(
  '/deleteCategory/:categoryId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  categoryIdParamValidation,
  validationHandler,
  CategoryController.deleteCategory
);

export default router;
