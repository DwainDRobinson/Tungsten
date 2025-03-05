'use strict';

import logger from '../logger';
import { TaskService } from '../services';

exports.getTasks = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await TaskService.getTasks(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with getting tasks: ${err.message}`);
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const [statusCode, response] = await TaskService.getTask(taskId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with getting task metadata by id: ${taskId}: ${err.message}`
    );
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await TaskService.createTask(body);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with creating new task: ${err.message}`);
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { name } = req.body;
    const [statusCode, response] = await TaskService.updateTask(taskId, name);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating task ${taskId}: ${err.message}`);
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const [statusCode, response] = await TaskService.deleteTask(taskId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting task by id: ${taskId}: ${err.message}`);
    next(err);
  }
};
