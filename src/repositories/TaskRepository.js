'use strict';

import { UserRepository } from '.';
import logger from '../logger';
import models from '../models';

exports.getTasks = async query => {
  try {
    const { Task } = models;
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

    const tasks = await Task.find(search, null, options).lean().exec();
    const total = await Task.countDocuments(search);

    const result = tasks.map(task => ({
      ...task,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting task data from db: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};

exports.getTask = async taskId => {
  try {
    const { Task } = models;
    const task = await Task.findOne({ taskId });
    return task;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting role data from db by id: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};

exports.getTaskByUser = async userId => {
  try {
    const { Task } = models;
    const task = await Task.findOne({ userId });
    return task;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting role data from db by userId: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};

exports.getTasksByUser = async userId => {
  try {
    const { Task } = models;
    const descendantUsers = await UserRepository.getHierarchyOfUsers(userId);
    const userIds = [userId, ...descendantUsers.map(u => u.userId)];
    const tasks = await Task.find({ assignedTo: { $in: userIds } });
    return tasks;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting task data from db by userId: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};

exports.getTaskByName = async name => {
  try {
    const { Task } = models;
    const task = await Task.findOne({ name });
    return task;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting task data from db by name: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};

exports.createTask = async payload => {
  try {
    const { Task } = models;
    const existingTask = await Task.findOne({ name: payload.name });
    if (existingTask) {
      return [new Error('task with name already exists.')];
    }
    const t = new Task(payload);
    const createdTask = await t.save();
    const { description, name, difficultyId } = createdTask;
    return [null, { description, name, difficultyId }];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving task data to db: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};

exports.updateTask = async (difficultyId, payload) => {
  try {
    const { Task } = models;
    const filter = { difficultyId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const task = await Task.findOneAndUpdate(filter, update, options);
    return [null, task];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating task data to db by userId: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};

exports.deleteTask = async difficultyId => {
  try {
    const { Task } = models;
    const deletedTask = await Task.deleteOne({ difficultyId });
    if (deletedTask.deletedCount > 0) {
      return [null, deletedTask];
    }
    return [new Error('Unable to find task to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting task data from db by id: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};
