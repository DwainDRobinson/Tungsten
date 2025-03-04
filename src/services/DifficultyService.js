'use strict';

import logger from '../logger';
import { DifficultyRespository } from '../repositories';
import {
  badRequest,
  HttpStatusCodes,
  internalServerErrorRequest
} from '../response-codes';

exports.getDifficulties = async query => {
  try {
    const difficulties = await DifficultyRespository.getDifficulties(query);
    if (difficulties) {
      return [
        HttpStatusCodes.OK,
        { message: 'Difficulties fetched from db with success', difficulties }
      ];
    } else {
      return badRequest(
        `Unable to find difficulties that matched the search criteria.`
      );
    }
  } catch (err) {
    logger.error('Error getting difficulties: ', err);
    return internalServerErrorRequest('Error getting difficulties.');
  }
};

exports.getDifficulty = async difficultyId => {
  try {
    const difficulty = await DifficultyRespository.getDifficultyById(
      difficultyId
    );
    if (difficulty) {
      return [
        HttpStatusCodes.OK,
        { message: 'Difficulty fetched from db with success', difficulty }
      ];
    } else {
      return badRequest(`No difficulty found with id provided.`);
    }
  } catch (err) {
    logger.error('Error getting difficulty by id ', err);
    return internalServerErrorRequest('Error getting difficulty by id.');
  }
};

exports.createDifficulty = async payload => {
  try {
    const [error, difficulty] = await DifficultyRespository.createDifficulty(
      payload
    );
    if (difficulty) {
      return [
        HttpStatusCodes.CREATED,
        { message: 'Difficulty created with success.', difficulty }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error creating new difficulty: ', err);
    return internalServerErrorRequest('Error creating new difficulty.');
  }
};

exports.updateDifficulty = async (difficultyId, payload) => {
  try {
    const [error, difficulty] = await DifficultyRespository.updateDifficulty(
      difficultyId,
      payload
    );
    if (difficulty) {
      return [
        HttpStatusCodes.OK,
        { message: 'Difficulty updated with success.', difficulty }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error updating existing difficulty: ', err);
    return internalServerErrorRequest('Error updating existing difficulty.');
  }
};

exports.deleteDifficultyById = async difficultyId => {
  try {
    const [error, deletedDifficulty] =
      await DifficultyRespository.deleteDifficultyById(difficultyId);
    if (deletedDifficulty) {
      return [HttpStatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting difficulty by id: ', err);
    return internalServerErrorRequest('Error deleting difficulty by id.');
  }
};
