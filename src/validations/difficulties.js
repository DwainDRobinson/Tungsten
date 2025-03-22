'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const difficultyQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for difficulties.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for difficulties.'),
  query('name')
    .isString()
    .withMessage('Must provide a existing difficulty name.')
    .optional()
];

const difficultyPostValidation = [
  body('name').isString().withMessage('Must provide a difficulty name.'),
  body('description')
    .isString()
    .withMessage('Must provide a difficulty description.')
];

const difficultyIdParamValidation = [
  param('difficultyId')
    .isString()
    .withMessage('Must provide a existing difficulty id.')
];

const difficultyUpdateValidation = [
  param('difficultyId')
    .isString()
    .withMessage('Must provide a existing difficulty id.'),
  body('name')
    .isString()
    .optional()
    .withMessage('Must provide a difficulty name.'),
  body('description')
    .isString()
    .optional()
    .withMessage('Must provide a difficulty description.')
];

export {
  difficultyIdParamValidation,
  difficultyPostValidation,
  difficultyQueryValidation,
  difficultyUpdateValidation
};
