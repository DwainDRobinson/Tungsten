'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const statusQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for categories.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for categories.'),
  query('name')
    .isString()
    .withMessage('Must provide a existing status name.')
    .optional()
];

const statusPostValidation = [
  body('name').isString().withMessage('Must provide a status name.'),
  body('description')
    .isString()
    .withMessage('Must provide a status description.')
];

const statusIdParamValidation = [
  param('statusId').isString().withMessage('Must provide a existing status id.')
];

const statusUpdateValidation = [
  param('statusId')
    .isString()
    .withMessage('Must provide a existing status id.'),
  body('name').isString().optional().withMessage('Must provide a status name.'),
  body('description')
    .isString()
    .optional()
    .withMessage('Must provide a status description.')
];

export {
  statusIdParamValidation,
  statusPostValidation,
  statusQueryValidation,
  statusUpdateValidation
};
