'use strict';

import logger from '../logger';
import { StatusService } from '../services';

exports.getStatuses = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await StatusService.getStatuses(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with getting categories: `, err);
    next(err);
  }
};

exports.getStatus = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const [statusCode, response] = await StatusService.getStatus(categoryId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with getting category metadata by id: ${categoryId}: `,
      err
    );
    next(err);
  }
};

exports.createStatus = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await StatusService.createStatus(body);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with creating new category: `, err);
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { body } = req;
    const [statusCode, response] = await StatusService.updateStatus(
      categoryId,
      body
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating category: `, err);
    next(err);
  }
};

exports.deleteStatus = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const [statusCode, response] = await StatusService.deleteStatus(categoryId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting category by id: ${categoryId}: `, err);
    next(err);
  }
};
