'use strict';

import logger from '../logger';
import models from '../models';

const findTagByName = async name => {
  try {
    const { Tag } = models;
    const tag = await Tag.findOne({ name });
    return tag ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting tag data from db by name: ${err.message}`);
    return false;
  }
};

const findTag = async tagId => {
  try {
    const { Tag } = models;
    const tag = await Tag.findOne({ tagId });
    return tag ?? false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting tag data from db by id: ${err.message}`);
    return false;
  }
};

exports.getTags = async query => {
  try {
    const { Tag } = models;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = query;

    const search = {};

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { [sort]: order === 'asc' ? 1 : -1 }
    };

    // Fetch data and count total documents
    const tags = await Tag.find(search, null, options).lean().exec();
    const total = await Tag.countDocuments(search);

    const result = tags.map(tag => ({
      ...tag,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
    return [new Error('No tags found with selected query params')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting tag data from db: ${err.message}`);
    return [new Error('Unable to find tags by search criteria.')];
  }
};

exports.getTag = async tagId => {
  try {
    const tag = await findTag(tagId);
    if (tag) {
      return [null, tag];
    }
    return [new Error('Unable to find tag by id.')];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting tag data from db by id: ${tagId}: ${err.message}`
    );
    return [new Error('Unable to find tag by id.')];
  }
};

exports.getTagByName = async name => {
  try {
    const tag = await findTagByName(name);
    if (tag) {
      return [null, tag];
    }
    return [new Error('Unable to find tag by id.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting tag data from db by name: ${err.message}`);
    return [new Error('Unable to find tag by name.')];
  }
};

exports.createTag = async payload => {
  try {
    const { Tag } = models;
    const tag = await findTagByName(payload.name);
    if (tag) {
      return [new Error('Tag with name already exists.')];
    }
    const t = new Tag(payload);
    const createdTag = await t.save();
    return [null, createdTag];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving tag data to db: ${err.message}`);
    return [new Error('Unable to save tag to db.')];
  }
};

exports.updateTag = async (tagId, payload) => {
  try {
    const { Tag } = models;
    const filter = { tagId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const tag = await Tag.findOneAndUpdate(filter, update, options);
    return [null, tag];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating tag data to db: ${err.message}`);
    return [new Error('Unable to update tag.')];
  }
};

exports.deleteTag = async tagId => {
  try {
    const { Tag } = models;
    const deletedTag = await Tag.deleteOne({ tagId });
    if (deletedTag.deletedCount > 0) {
      return [null, deletedTag];
    }
    return [new Error('Unable to find tag to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting tag by id ${tagId}: ${err.message}`);
    return [new Error('Unable to delete tag.')];
  }
};
