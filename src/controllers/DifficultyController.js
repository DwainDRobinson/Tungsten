'use strict';

import logger from '../logger';
import { DifficultyService } from '../services';

exports.getDifficulties = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await DifficultyService.getDifficulties(
      query
    );
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with getting difficulties: ${err.message}`);
    next(err);
  }
};

exports.getDifficulty = async (req, res, next) => {
  try {
    const { difficultyId } = req.params;
    const [statusCode, response] = await DifficultyService.getDifficulty(
      difficultyId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with getting difficulty metadata by id: ${difficultyId}: ${err.message}`
    );
    next(err);
  }
};

exports.createDifficulty = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await DifficultyService.createDifficulty(
      body
    );
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with creating new difficulty: ${err.message}`);
    next(err);
  }
};

exports.updateDifficulty = async (req, res, next) => {
  try {
    const { difficultyId } = req.params;
    const { name } = req.body;
    const [statusCode, response] = await DifficultyService.updateDifficulty(
      difficultyId,
      name
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with updating difficulty ${difficultyId}: ${err.message}`
    );
    next(err);
  }
};

exports.deleteDifficulty = async (req, res, next) => {
  try {
    const { difficultyId } = req.params;
    const [statusCode, response] = await DifficultyService.deleteDifficulty(
      difficultyId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with deleting difficulty by id: ${difficultyId}: ${err.message}`
    );
    next(err);
  }
};
