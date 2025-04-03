'use strict';

import logger from '../logger';
import models from '../models';

const findCategoryByName = async name => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name });
    return category ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting category data from db by name: ${err.message}`);
    return false;
  }
};

const findCategory = async categoryId => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ categoryId });
    return category ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error retrieving category by ID from db: ${err.message}`);
  }
};

exports.getCategories = async query => {
  try {
    const { Category } = models;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = query;

    const search = {};

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { [sort]: order === 'asc' ? 1 : -1 }
    };

    const categories = await Category.find(search, null, options).lean().exec();
    const total = await Category.countDocuments(search);

    const result = categories.map(category => ({
      ...category,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
    return [new Error('No categories found with selected query params')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting category data from db: ${err.message}`);
    return [new Error('Error getting category data from db.')];
  }
};

exports.getCategory = async categoryId => {
  try {
    const category = await findCategory(categoryId);
    if (category) {
      return [null, category];
    }
    return [new Error('Category not found by the provided ID.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error retrieving category by ID from db: ${err.message}`);
    return [new Error('Error retrieving category by ID from db.')];
  }
};

exports.getCategoryByName = async name => {
  try {
    const category = await findCategoryByName(name);
    if (category) {
      return [null, category];
    }
    return [new Error('Error getting category data from db by name.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting category data from db by name: ${err.message}`);
    return [new Error('Error getting category data from db by name.')];
  }
};

exports.createCategory = async payload => {
  try {
    const { Category } = models;
    const existingCategory = await findCategoryByName(payload.name);
    if (existingCategory) {
      return [new Error('category with name already exists.')];
    }
    const category = new Category(payload);
    const createdCategory = await category.save();
    return [null, createdCategory];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving category data to db: ${err.message}`);
    return [new Error('Error saving category data to db.')];
  }
};

exports.updateCategory = async (categoryId, payload) => {
  try {
    const { Category } = models;
    const filter = { categoryId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const category = await Category.findOneAndUpdate(filter, update, options);
    return [null, category];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating category data to db: ${err.message}`);
    return [new Error('Error updating category data to db.')];
  }
};

exports.deleteCategory = async categoryId => {
  try {
    const { Category } = models;
    const deletedCategory = await Category.deleteOne({ categoryId });
    if (deletedCategory.deletedCount > 0) {
      return [null, deletedCategory];
    }
    return [new Error('Category not found for deletion.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting category by ID from db: ${err.message}`);
    return [new Error('Error deleting category by ID from db.')];
  }
};
