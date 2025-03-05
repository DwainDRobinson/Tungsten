'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const taskQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for tasks.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for tasks.')
];

const taskPostValidation = [
  body('name').isString().withMessage('Must provide a task name.'),
  body('value').isString().withMessage('Must provide a value for the role.'),
  body('description').isString().withMessage('Must provide a task description.')
];

const taskIdParamValidation = [
  param('taskId').isString().withMessage('Must provide a existing task id.')
];

const taskUpdateValidation = [
  param('taskId').isString().withMessage('Must provide a existing task id.'),
  body('name').isString().optional().withMessage('Must provide a task name.'),
  body('value')
    .isString()
    .optional()
    .withMessage('Must provide a value for the role.'),
  body('description')
    .isString()
    .optional()
    .withMessage('Must provide a task description.')
];

export {
  taskIdParamValidation,
  taskPostValidation,
  taskQueryValidation,
  taskUpdateValidation
};
