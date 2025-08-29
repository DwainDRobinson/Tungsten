'use strict';

import logger from '../logger';
import { ActivityRepository } from '../repositories';
import {
  HttpStatusCodes,
  badRequest,
  internalServerErrorRequest
} from '../response-codes';

exports.getActivities = async query => {
  try {
    const [error, activities] = await ActivityRepository.getActivities(query);
    if (activities) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Fetcing of activities action was successful.',
          activities
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log(err);
    logger.error(`Error getting all activities: ${err.message}`);
    return internalServerErrorRequest('Error getting activities.');
  }
};

exports.getActivity = async activityId => {
  try {
    const [error, activity] = await ActivityRepository.getActivity(activityId);
    if (activity) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Activities was successfully fetched.',
          activity
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error getting activity: ${err.message}`);
    return internalServerErrorRequest('Error getting activity.');
  }
};

exports.createActivity = async payload => {
  try {
    const [error, activity] = await ActivityRepository.createActivity(payload);
    if (activity) {
      return [
        HttpStatusCodes.CREATED,
        {
          message: 'Activity created with success.',
          activity
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log(err);
    logger.error(`Error creating activity: ${err.message}`);
    return internalServerErrorRequest('Error creating activity.');
  }
};

exports.updateActivity = async (activityId, payload) => {
  try {
    const [error, updatedActivity] = await ActivityRepository.updateActivity(
      activityId,
      payload
    );
    if (updatedActivity) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Activities was successfully updated.',
          activity: updatedActivity
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error updating activity: ${err.message}`);
    return internalServerErrorRequest('Error updating activity.');
  }
};

exports.deleteActivity = async activityId => {
  try {
    const [error, activity] = await ActivityRepository.getActivity(activityId);
    if (activity) {
      const [error, deletedActivity] = await ActivityRepository.deleteActivity(
        activityId
      );
      if (deletedActivity) {
        return [HttpStatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error deleting activity by id: ${err.message}`);
    return internalServerErrorRequest('Error deleting activity by id.');
  }
};
