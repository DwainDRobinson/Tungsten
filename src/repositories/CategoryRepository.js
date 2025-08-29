'use strict';

import logger from '../logger';
import models from '../models';

// Find category by name
const findCategoryByName = async name => {
  if (!name) return null;
  try {
    const { Category } = models;
    return await Category.findOne({ name }).lean();
  } catch (err) {
    logger.error(`Error getting category data from db by name: ${err.message}`);
    return null;
  }
};

// Find category by ID
const findCategory = async categoryId => {
  if (!categoryId) return null;
  try {
    const { Category } = models;
    return await Category.findOne({ categoryId }).lean();
  } catch (err) {
    logger.error(`Error retrieving category by ID from db: ${err.message}`);
    return null;
  }
};

// Get paginated categories
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
    if (!categories.length) {
      return [new Error('No categories found with selected query params')];
    }
    const result = categories.map(category => ({
      ...category,
      total,
      pages: Math.ceil(total / limit)
    }));
    return [null, result];
  } catch (err) {
    logger.error(`Error getting category data from db: ${err.message}`);
    return [new Error('Error getting category data from db.')];
  }
};

// Get category by ID
exports.getCategory = async categoryId => {
  if (!categoryId) return [new Error('Category ID is required.')];
  try {
    const category = await findCategory(categoryId);
    if (category) {
      return [null, category];
    }
    return [new Error('Category not found by the provided ID.')];
  } catch (err) {
    logger.error(`Error retrieving category by ID from db: ${err.message}`);
    return [new Error('Error retrieving category by ID from db.')];
  }
};

// Get category by name
exports.getCategoryByName = async name => {
  if (!name) return [new Error('Category name is required.')];
  try {
    const category = await findCategoryByName(name);
    if (category) {
      return [null, category];
    }
    return [new Error('Category not found by the provided name.')];
  } catch (err) {
    logger.error(`Error getting category data from db by name: ${err.message}`);
    return [new Error('Error getting category data from db by name.')];
  }
};

// Create a new category
exports.createCategory = async payload => {
  if (!payload || !payload.name)
    return [new Error('Category name is required.')];
  try {
    const { Category } = models;
    const existingCategory = await findCategoryByName(payload.name);
    if (existingCategory) {
      return [new Error('Category with this name already exists.')];
    }
    const category = new Category(payload);
    const createdCategory = await category.save();
    return [null, createdCategory];
  } catch (err) {
    logger.error(`Error saving category data to db: ${err.message}`);
    return [new Error('Error saving category data to db.')];
  }
};

// Update a category by ID
exports.updateCategory = async (categoryId, payload) => {
  if (!categoryId) return [new Error('Category ID is required.')];
  try {
    const { Category } = models;
    const filter = { categoryId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const category = await Category.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();
    return [null, category];
  } catch (err) {
    logger.error(`Error updating category data to db: ${err.message}`);
    return [new Error('Error updating category data to db.')];
  }
};

// Delete a category by ID
exports.deleteCategory = async categoryId => {
  if (!categoryId) return [new Error('Category ID is required.')];
  try {
    const { Category } = models;
    const deletedCategory = await Category.deleteOne({ categoryId });
    if (deletedCategory.deletedCount > 0) {
      return [null, deletedCategory];
    }
    return [new Error('Category not found for deletion.')];
  } catch (err) {
    logger.error(`Error deleting category by ID from db: ${err.message}`);
    return [new Error('Error deleting category by ID from db.')];
  }
};
