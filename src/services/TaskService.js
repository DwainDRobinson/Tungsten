'use strict';

import logger from '../logger';
import { TaskRepository } from '../repositories';
import {
  HttpStatusCodes,
  badRequest,
  internalServerErrorRequest
} from '../response-codes';

exports.getTasks = async query => {
  try {
    const [error, tasks] = await TaskRepository.getTasks(query);
    if (tasks) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Fetcing of tasks action was successful.',
          tasks
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log(err);
    logger.error(`Error getting all tasks: ${err.message}`);
    return internalServerErrorRequest('Error getting tasks.');
  }
};

exports.getTask = async taskId => {
  try {
    const [error, task] = await TaskRepository.getTask(taskId);
    if (task) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Tasks was successfully fetched.',
          task
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error getting task: ${err.message}`);
    return internalServerErrorRequest('Error getting task.');
  }
};

exports.getTasksByUser = async userId => {
  try {
    const [error, tasks] = await TaskRepository.getTasksByUser(userId);
    if (tasks) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Tasks was successfully fetched.',
          tasks
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error getting tasks: ${err.message}`);
    return internalServerErrorRequest('Error getting tasks.');
  }
};

exports.createTask = async payload => {
  try {
    const [error, task] = await TaskRepository.createTask(payload);
    if (task) {
      return [
        HttpStatusCodes.CREATED,
        {
          message: 'Task created with success.',
          task
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log(err);
    logger.error(`Error creating task: ${err.message}`);
    return internalServerErrorRequest('Error creating task.');
  }
};

exports.updateTask = async (taskId, payload) => {
  try {
    const [error, updatedTasks] = await TaskRepository.updateTask(
      taskId,
      payload
    );
    if (updatedTasks) {
      return [
        HttpStatusCodes.OK,
        { message: 'Tasks was successfully updated.', task: updatedTasks }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error updating task: ${err.message}`);
    return internalServerErrorRequest('Error updating task.');
  }
};

exports.deleteTask = async taskId => {
  try {
    const [error, task] = await TaskRepository.getTask(taskId);
    if (task) {
      const [error, deletedTasks] = await TaskRepository.deleteTask(taskId);
      if (deletedTasks) {
        return [HttpStatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error deleting task by id: ${err.message}`);
    return internalServerErrorRequest('Error deleting task by id.');
  }
};
