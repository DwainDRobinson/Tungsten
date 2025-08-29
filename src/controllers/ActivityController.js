'use strict';

import logger from '../logger';
import { ActivityService } from '../services';

exports.getActivities = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await ActivityService.getActivities(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with getting activities: ${err.message}`);
    next(err);
  }
};

exports.getActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const [statusCode, response] = await ActivityService.getActivity(
      activityId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with getting activity metadata by id: ${activityId}: ${err.message}`
    );
    next(err);
  }
};

exports.createActivity = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await ActivityService.createActivity(body);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with creating new activity: ${err.message}`);
    next(err);
  }
};

exports.updateActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { name } = req.body;
    const [statusCode, response] = await ActivityService.updateActivity(
      activityId,
      name
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating activity ${activityId}: ${err.message}`);
    next(err);
  }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const [statusCode, response] = await ActivityService.deleteActivity(
      activityId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with deleting activity by id: ${activityId}: ${err.message}`
    );
    next(err);
  }
};
