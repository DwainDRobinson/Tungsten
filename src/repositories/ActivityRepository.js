'use strict';

import { UserRepository } from '.';
import logger from '../logger';
import models from '../models';

const findActivityByName = async name => {
  try {
    const { Activity } = models;
    const activity = await Activity.findOne({ name });
    return activity ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting activity data from db by name: ${err.message}`);
    return false;
  }
};

const findActivity = async activityId => {
  try {
    const { Activity } = models;
    const activity = await Activity.findOne({ activityId });
    return activity ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting activity data from db by id: ${err.message}`);
    return false;
  }
};

exports.getActivities = async query => {
  try {
    const { Activity } = models;
    const {
      userId,
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = query;

    const [error, user] = await UserRepository.getUserById(userId);

    if (error || !user) {
      return [new Error(error.message)];
    }

    //TODO: Fix filtering for activity base access.
    const search = {};

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { [sort]: order === 'asc' ? 1 : -1 }
    };

    const activities = await Activity.find(search, null, options).lean().exec();
    const total = await Activity.countDocuments(search);

    const result = activities.map(activity => ({
      ...activity,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
    return [new Error('No tasks found with selected query params')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting activity data from db: ${err.message}`);
    return [new Error('Unable to get activity data from db.')];
  }
};

exports.getActivitiesById = async activityId => {
  try {
    const activity = await findActivity(activityId);
    if (activity) {
      return [null, activity];
    }
    return [new Error('Unable to get activity data from db by id.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting activity data from db by id: ${err.message}`);
    return [new Error('Unable to get activity data from db.')];
  }
};

exports.getActivityByName = async name => {
  try {
    const activity = await findActivityByName(name);
    if (activity) {
      return [null, activity];
    }
    return [new Error('Unable to get activity data from db by name.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting activity data from db by name: ${err.message}`);
    return [new Error('Unable to get activity data from db.')];
  }
};

exports.createActivity = async payload => {
  try {
    const { Activity } = models;
    const existingActivity = await findActivityByName(payload.name);
    if (existingActivity) {
      return [new Error('Activity with name already exists.')];
    }
    const a = new Activity(payload);
    const createdActivity = await a.save();
    return [null, createdActivity];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving activity data to db: ${err.message}`);
    return [new Error('Unable to get activity data from db.')];
  }
};

exports.updateActivity = async (activityId, payload) => {
  try {
    const { Activity } = models;
    const filter = { activityId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const activity = await Activity.findOneAndUpdate(filter, update, options);
    return [null, activity];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error updating activity data to db by userId: ${err.message}`
    );
    return [new Error('Unable to update activity data from db.')];
  }
};

exports.deleteActivity = async activityId => {
  try {
    const { Activity } = models;
    const deletedActivity = await Activity.deleteOne({ activityId });
    if (deletedActivity.deletedCount > 0) {
      return [null, deletedActivity];
    }
    return [new Error('Unable to find activity to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting activity data from db by id: ${err.message}`);
    return [new Error('Unable to delete activity data from db.')];
  }
};
