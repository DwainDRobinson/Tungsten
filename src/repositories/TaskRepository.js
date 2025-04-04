'use strict';

import { UserRepository } from '.';
import logger from '../logger';
import models from '../models';

const findTaskByName = async name => {
  try {
    const { Task } = models;
    const task = await Task.findOne({ name });
    return task ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting task data from db by name: ${err.message}`);
    return false;
  }
};

const findTask = async taskId => {
  try {
    const { Task } = models;
    const task = await Task.findOne({ taskId });
    return task ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting task data from db by id: ${err.message}`);
    return false;
  }
};

exports.getTasks = async query => {
  try {
    const { Task } = models;
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

    //TODO: Fix filtering for task base access.
    const search = {};

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
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
    return [new Error('No tasks found with selected query params')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting task data from db: ${err.message}`);
    return [new Error('Unable to get task data from db.')];
  }
};

exports.getTask = async taskId => {
  try {
    const task = await findTask(taskId);
    if (task) {
      return [null, task];
    }
    return [new Error('Unable to get task data from db by id.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting task data from db by id: ${err.message}`);
    return [new Error('Unable to get task data from db.')];
  }
};

exports.getTaskByName = async name => {
  try {
    const task = await findTaskByName(name);
    if (task) {
      return [null, task];
    }
    return [new Error('Unable to get task data from db by name.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting task data from db by name: ${err.message}`);
    return [new Error('Unable to get task data from db.')];
  }
};

exports.createTask = async payload => {
  try {
    const { Task } = models;
    const existingTask = await await findTaskByName(payload.name);
    if (existingTask) {
      return [new Error('task with name already exists.')];
    }
    const t = new Task(payload);
    const createdTask = await t.save();
    return [null, createdTask];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving task data to db: ${err.message}`);
    return [new Error('Unable to get task data from db.')];
  }
};

exports.updateTask = async (taskId, payload) => {
  try {
    const { Task } = models;
    const filter = { taskId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const task = await Task.findOneAndUpdate(filter, update, options);
    return [null, task];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating task data to db by userId: ${err.message}`);
    return [new Error('Unable to update task data from db.')];
  }
};

exports.deleteTask = async taskId => {
  try {
    const { Task } = models;
    const deletedTask = await Task.deleteOne({ taskId });
    if (deletedTask.deletedCount > 0) {
      return [null, deletedTask];
    }
    return [new Error('Unable to find task to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting task data from db by id: ${err.message}`);
    return [new Error('Unable to delete task data from db.')];
  }
};
