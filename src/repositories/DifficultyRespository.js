'use strict';

import logger from '../logger';
import models from '../models';

exports.getCategories = async query => {
  try {
    const { Difficulty } = models;
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

    const difficulties = await Difficulty.find(search, null, options)
      .lean()
      .exec();
    const total = await Difficulty.countDocuments(search);

    const result = difficulties.map(difficulty => ({
      ...difficulty,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
  } catch (err) {
    logger.error('Error getting difficulty data from db: ', err);
  }
};

exports.getDifficulty = async difficultyId => {
  try {
    const { Difficulty } = models;
    const difficulty = await Difficulty.findOne({ difficultyId });
    return difficulty;
  } catch (err) {
    logger.error('Error getting difficulty data from db by id: ', err);
  }
};

exports.getDifficultyByName = async name => {
  try {
    const { Difficulty } = models;
    const difficulty = await Difficulty.findOne({ name });
    return difficulty;
  } catch (err) {
    logger.error('Error getting difficulty data from db by name: ', err);
  }
};

exports.createDifficulty = async payload => {
  try {
    const { Difficulty } = models;
    const existingDifficulty = await Difficulty.findOne({ name: payload.name });
    if (existingDifficulty) {
      return [new Error('difficulty with name already exists.')];
    }
    const diff = new Difficulty(payload);
    const createdDifficulty = await diff.save();
    const { description, name, difficultyId } = createdDifficulty;
    return [null, { description, name, difficultyId }];
  } catch (err) {
    logger.error('Error saving difficulty data to db: ', err);
  }
};

exports.updateDifficulty = async (difficultyId, payload) => {
  try {
    const { Difficulty } = models;
    const filter = { difficultyId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const difficulty = await Difficulty.findOneAndUpdate(
      filter,
      update,
      options
    );
    return [null, difficulty];
  } catch (err) {
    logger.error('Error updating difficulty data to db: ', err);
  }
};

exports.deleteDifficulty = async difficultyId => {
  try {
    const { Difficulty } = models;
    const deletedDifficulty = await Difficulty.deleteOne({ difficultyId });
    if (deletedDifficulty.deletedCount > 0) {
      return [null, deletedDifficulty];
    }
    return [new Error('Unable to find difficulty to delete details.')()];
  } catch (err) {
    logger.error('Error deleting difficulty by id: ', err);
  }
};
