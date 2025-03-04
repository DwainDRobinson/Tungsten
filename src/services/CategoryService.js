'use strict';

import logger from '../logger';
import { CategoryRespository } from '../repositories';
import {
  badRequest,
  HttpStatusCodes,
  internalServerErrorRequest
} from '../response-codes';

exports.getCategories = async query => {
  try {
    const categories = await CategoryRespository.getCategories(query);
    if (categories) {
      return [
        HttpStatusCodes.OK,
        { message: 'Categories fetched from db with success', categories }
      ];
    } else {
      return badRequest(
        `Unable to find categories that matched the search criteria.`
      );
    }
  } catch (err) {
    logger.error('Error getting categories: ', err);
    return internalServerErrorRequest('Error getting categories.');
  }
};

exports.getCategory = async categoryId => {
  try {
    const category = await CategoryRespository.getCategory(categoryId);
    if (category) {
      return [
        HttpStatusCodes.OK,
        { message: 'Category fetched from db with success', category }
      ];
    } else {
      return badRequest(`No category found with id provided.`);
    }
  } catch (err) {
    logger.error('Error getting category by id ', err);
    return internalServerErrorRequest('Error getting category by id.');
  }
};

exports.createCategory = async payload => {
  try {
    const [error, category] = await CategoryRespository.createCategory(payload);
    if (category) {
      return [
        HttpStatusCodes.CREATED,
        { message: 'Category created with success.', category }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error creating new category: ', err);
    return internalServerErrorRequest('Error creating new category.');
  }
};

exports.updateCategory = async (categoryId, payload) => {
  try {
    const [error, category] = await CategoryRespository.updateCategory(
      categoryId,
      payload
    );
    if (category) {
      return [
        HttpStatusCodes.OK,
        { message: 'Category updated with success.', category }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error updating existing category: ', err);
    return internalServerErrorRequest('Error updating existing category.');
  }
};

exports.deleteCategory = async categoryId => {
  try {
    const [error, deletedCategory] = await CategoryRespository.deleteCategory(
      categoryId
    );
    if (deletedCategory) {
      return [HttpStatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting category by id: ', err);
    return internalServerErrorRequest('Error deleting category by id.');
  }
};
