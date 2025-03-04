'use strict';

import logger from '../logger';
import { StatusRespository } from '../repositories';
import {
  badRequest,
  HttpStatusCodes,
  internalServerErrorRequest
} from '../response-codes';

exports.getDifficulties = async query => {
  try {
    const statuses = await StatusRespository.getDifficulties(query);
    if (statuses) {
      return [
        HttpStatusCodes.OK,
        { message: 'Difficulties fetched from db with success', statuses }
      ];
    } else {
      return badRequest(
        `Unable to find statuses that matched the search criteria.`
      );
    }
  } catch (err) {
    logger.error('Error getting statuses: ', err);
    return internalServerErrorRequest('Error getting statuses.');
  }
};

exports.getStatus = async statusId => {
  try {
    const status = await StatusRespository.getStatus(statusId);
    if (status) {
      return [
        HttpStatusCodes.OK,
        { message: 'Status fetched from db with success', status }
      ];
    } else {
      return badRequest(`No status found with id provided.`);
    }
  } catch (err) {
    logger.error('Error getting status by id ', err);
    return internalServerErrorRequest('Error getting status by id.');
  }
};

exports.createStatus = async payload => {
  try {
    const [error, status] = await StatusRespository.createStatus(payload);
    if (status) {
      return [
        HttpStatusCodes.CREATED,
        { message: 'Status created with success.', status }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error creating new status: ', err);
    return internalServerErrorRequest('Error creating new status.');
  }
};

exports.updateStatus = async (statusId, payload) => {
  try {
    const [error, status] = await StatusRespository.updateStatus(
      statusId,
      payload
    );
    if (status) {
      return [
        HttpStatusCodes.OK,
        { message: 'Status updated with success.', status }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error updating existing status: ', err);
    return internalServerErrorRequest('Error updating existing status.');
  }
};

exports.deleteStatus = async statusId => {
  try {
    const [error, deletedStatus] = await StatusRespository.deleteStatus(
      statusId
    );
    if (deletedStatus) {
      return [HttpStatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting status by id: ', err);
    return internalServerErrorRequest('Error deleting status by id.');
  }
};
