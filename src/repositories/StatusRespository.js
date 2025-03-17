'use strict';

import logger from '../logger';
import models from '../models';
import { isObjectEmpty } from '../utilities/objects';

exports.getStatuses = async query => {
  try {
    const { Status } = models;
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      ...filters
    } = query;

    // Build filter query
    const search = {};
    if (!isObjectEmpty(filters)) {
      Object.keys(filters).forEach(key => {
        search[key] = new RegExp(filters[key], 'i'); // Regex for partial match (case-insensitive)
      });
    }

    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { [sort]: order === 'asc' ? 1 : -1 }
    };

    const statuses = await Status.find(search, null, options).lean().exec();
    const total = await Status.countDocuments(search);

    const result = statuses.map(status => ({
      ...status,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting status data from db: ${err.message}`);
    return [new Error('Error getting status data from db.')];
  }
};

exports.getStatus = async statusId => {
  try {
    const { Status } = models;
    const status = await Status.findOne({ statusId });
    return status;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting status data from db by id: ${err.message}`);
    return [new Error('Error getting status data from db by id.')];
  }
};

exports.getStatusByName = async name => {
  try {
    const { Status } = models;
    const status = await Status.findOne({ name });
    return status;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting status data from db by name: ${err.message}`);
    return [new Error('Error getting status data from db by name.')];
  }
};

exports.createStatus = async payload => {
  try {
    const { Status } = models;
    const status = await Status.findOne({ name: payload.name });
    if (status) {
      return [new Error('status with name already exists.')];
    }
    const cat = new Status(payload);
    const createdStatus = await cat.save();
    const { description, name, statusId } = createdStatus;
    return [null, { description, name, statusId }];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving status data to db: ${err.message}`);
    return [new Error('Error saving status data to db.')];
  }
};

exports.updateStatus = async (statusId, payload) => {
  try {
    const { Status } = models;
    const filter = { statusId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const status = await Status.findOneAndUpdate(filter, update, options);
    return [null, status];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating status data to db: ${err.message}`);
    return [new Error('Error updating status data to db.')];
  }
};

exports.deleteStatus = async statusId => {
  try {
    const { Status } = models;
    const deletedStatus = await Status.deleteOne({ statusId });
    if (deletedStatus.deletedCount > 0) {
      return [null, deletedStatus];
    }
    return [new Error('Unable to find status to delete details.')()];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting status data from db: ${err.message}`);
    return [new Error('Error deleting status data from db.')];
  }
};
