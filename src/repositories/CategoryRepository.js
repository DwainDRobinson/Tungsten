'use strict';

import logger from '../logger';
import models from '../models';

exports.getCategories = async query => {
  try {
    const { Category } = models;
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      ...filters
    } = query;

    // Build filter query
    const search = {};
    Object.keys(filters).forEach(key => {
      search[key] = new RegExp(filters[key], 'i'); // Regex for partial match (case-insensitive)
    });

    const options = {
      skip: (page - 1) * limit,
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
  } catch (err) {
    logger.error('Error getting category data from db: ', err);
  }
};

exports.getCategory = async categoryId => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ categoryId });
    return category;
  } catch (err) {
    logger.error('Error getting category data from db by id: ', err);
  }
};

exports.getCategoryByName = async name => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name });
    return category;
  } catch (err) {
    logger.error('Error getting category data from db by name: ', err);
  }
};

exports.createCategory = async payload => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name: payload.name });
    if (category) {
      return [new Error('category with name already exists.')];
    }
    const cat = new Category(payload);
    const createdCategory = await cat.save();
    const { description, name, categoryId } = createdCategory;
    return [null, { description, name, categoryId }];
  } catch (err) {
    logger.error('Error saving category data to db: ', err);
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
    logger.error('Error updating category data to db: ', err);
  }
};

exports.deleteCategory = async categoryId => {
  try {
    const { Category } = models;
    const deletedCategory = await Category.deleteOne({ categoryId });
    if (deletedCategory.deletedCount > 0) {
      return [null, deletedCategory];
    }
    return [new Error('Unable to find category to delete details.')()];
  } catch (err) {
    logger.error('Error deleting category by id: ', err);
  }
};
