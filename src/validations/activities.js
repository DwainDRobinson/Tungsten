'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const activityQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for activitys.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for activitys.')
];

const activityPostValidation = [
  body('name').isString().withMessage('Must provide a activity name.'),
  body('value').isString().withMessage('Must provide a value for the role.'),
  body('description')
    .isString()
    .withMessage('Must provide a activity description.')
];

const activityIdParamValidation = [
  param('activityId')
    .isString()
    .withMessage('Must provide a existing activity id.')
];

const activityUpdateValidation = [
  param('activityId')
    .isString()
    .withMessage('Must provide a existing activity id.'),
  body('name')
    .isString()
    .optional()
    .withMessage('Must provide a activity name.'),
  body('value')
    .isString()
    .optional()
    .withMessage('Must provide a value for the role.'),
  body('description')
    .isString()
    .optional()
    .withMessage('Must provide a activity description.')
];

export {
  activityIdParamValidation,
  activityPostValidation,
  activityQueryValidation,
  activityUpdateValidation
};
