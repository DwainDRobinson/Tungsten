'use strict';

import logger from '../logger';
import models from '../models';

const findDifficultyByName = async name => {
  try {
    const { Difficulty } = models;
    const difficulty = await Difficulty.findOne({ name });
    return difficulty ?? false;
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting difficulty data from db by name: ${err.message}`
    );
    return false;
  }
};

const findDifficulty = async difficultyId => {
  try {
    const { Difficulty } = models;
    const difficulty = await Difficulty.findOne({ difficultyId });
    return difficulty ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting difficulty data from db by id: ${err.message}`);
    return false;
  }
};

exports.getDifficulties = async query => {
  try {
    const { Difficulty } = models;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = query;

    const search = {};

    const options = {
      skip: (parstInt(page) - 1) * parseInt(limit),
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
    return [new Error('No difficulties found with selected query params')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting difficulty data from db.: ${err.message}`);
    return [new Error('Error getting difficulty data from db.')];
  }
};

exports.getDifficulty = async difficultyId => {
  try {
    const difficulty = await findDifficulty(difficultyId);
    if (difficulty) {
      return [null, difficulty];
    }
    return [new Error('Error getting difficulty data from db by id.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting difficulty data from db by id: ${err.message}`);
    return [new Error('Error getting difficulty data from db by id.')];
  }
};

exports.getDifficultyByName = async name => {
  try {
    const difficulty = await findDifficultyByName(name);
    if (difficulty) {
      return [null, difficulty];
    }
    return [new Error('Error getting difficulty data from db by name.')];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting difficulty data from db by name: ${err.message}`
    );
    return [new Error('Error getting difficulty data from db by name.')];
  }
};

exports.createDifficulty = async payload => {
  try {
    const { Difficulty } = models;
    const existingDifficulty = await findDifficultyByName(payload.name);
    if (existingDifficulty) {
      return [new Error('difficulty with name already exists.')];
    }
    const difficulty = new Difficulty(payload);
    const createdDifficulty = await difficulty.save();
    return [null, createdDifficulty];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving difficulty data to db: ${err.message}`);
    return [new Error('Error saving difficulty data to db.')];
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
    console.error(err);
    logger.error(`Error updating difficulty data to db: ${err.message}`);
    return [new Error('Error updating difficulty data to db.')];
  }
};

exports.deleteDifficulty = async difficultyId => {
  try {
    const { Difficulty } = models;
    const deletedDifficulty = await Difficulty.deleteOne({ difficultyId });
    if (deletedDifficulty.deletedCount > 0) {
      return [null, deletedDifficulty];
    }
    return [new Error('Unable to find difficulty to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting difficulty by id: ${err.message}`);
    return [new Error('Error deleting difficulty by id.')];
  }
};
