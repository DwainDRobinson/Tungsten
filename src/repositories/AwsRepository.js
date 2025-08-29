'use strict';

import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import config from '../config';
import { MEDIA } from '../constants';
import logger from '../logger';

import { s3Client } from '../clients';

const { aws } = config.sources;
const { s3, cloudFront } = aws;
const { s3VideoBucketName, s3ThumbnailBucketName, s3CoverImageBucketName } = s3;

const {
  videoDistributionURI,
  thumbnailDistributionURI,
  coverImageDistributionURI
} = cloudFront;

/**
 * Video helper functions
 */
const getVideoObjectKey = key => {
  return `${key}.${MEDIA.DEFAULT_VIDEO_FILE_EXTENTION}`;
};

const getThumbnailObjectKey = key => {
  return `${key}.${MEDIA.DEFAULT_THUMBNAIL_FILE_EXTENTION}`;
};

const getS3VideoParams = key => {
  return {
    Bucket: s3VideoBucketName,
    ...(key && {
      Key: getVideoObjectKey(key)
    })
  };
};

const getS3ThumbnailParams = key => {
  return {
    Bucket: s3ThumbnailBucketName,
    ...(key && {
      Key: getThumbnailObjectKey(key)
    })
  };
};

exports.getVideoDistributionURI = key => {
  return `${videoDistributionURI}/${getVideoObjectKey(key)}`;
};

exports.getThumbnailDistributionURI = key => {
  return `${thumbnailDistributionURI}/${getThumbnailObjectKey(key)}`;
};

exports.getIsVideoBucketAvailable = async () => {
  try {
    const params = getS3VideoParams();
    const command = new HeadBucketCommand(params);
    await s3Client.send(command);
    return true; // Bucket exists and is accessible
  } catch (error) {
    logger.error(err);
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsVideoBucketAvailable',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.getIsThumbnailBucketAvailable = async () => {
  try {
    const params = getS3ThumbnailParams();
    const command = new HeadBucketCommand(params);
    await s3Client.send(command);
    return true; // Bucket exists and is accessible
  } catch (error) {
    logger.error(err);
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsThumbnailBucketAvailable',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.createVideoBucket = async () => {
  try {
    const params = getS3VideoParams();
    const command = new CreateBucketCommand(params);
    await s3Client.send(command);
    return `Bucket "${s3VideoBucketName}" has been created successfully.`;
  } catch (error) {
    logger.error(err);
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'createVideoBucket',
      requestId,
      cfId,
      extendedRequestId
    });
  }
};

exports.createThumbnailBucket = async () => {
  try {
    const params = getS3ThumbnailParams();
    const command = new CreateBucketCommand(params);
    await s3Client.send(command);
    return `Bucket "${s3ThumbnailBucketName}" has been created successfully.`;
  } catch (error) {
    logger.error(err);
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'createThumbnailBucket',
      requestId,
      cfId,
      extendedRequestId
    });
  }
};

exports.getIsVideoObjectAvailable = async key => {
  try {
    const params = getS3VideoParams(key);
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true; // Object exists
  } catch (error) {
    logger.error(err);
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsVideoObjectAvailable',
      requestId,
      cfId,
      extendedRequestId
    });
    return false; // Object does not exist
  }
};

exports.getIsThumbnailObjectAvailable = async key => {
  try {
    const params = getS3ThumbnailParams(key);
    const command = new HeadObjectCommand(params);
    await s3Client.send(new HeadObjectCommand(command));
    return true; // Object exists
  } catch (error) {
    if (error.name === 'NotFound') {
      return false; // Object does not exist
    } else {
      const { requestId, cfId, extendedRequestId } = error.$metadata;
      logger.error({
        message: 'getIsThumbnailObjectAvailable',
        requestId,
        cfId,
        extendedRequestId
      });
      return false; // Object does not exist
    }
  }
};

exports.copyVideoObject = async (oldKey, newKey) => {
  if (!oldKey || !newKey)
    throw new Error('Both oldKey and newKey are required');
  try {
    const params = {
      ...getS3VideoParams(newKey),
      CopySource: `${s3VideoBucketName}/${getVideoObjectKey(oldKey)}`
    };
    const command = new CopyObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    logger.error(error);
    const { requestId, cfId, extendedRequestId } = error.$metadata || {};
    logger.error({
      message: 'copyVideoObject',
      requestId,
      cfId,
      extendedRequestId
    });
    throw error;
  }
};

exports.copyThumbnailObject = async (oldKey, newKey) => {
  if (!oldKey || !newKey)
    throw new Error('Both oldKey and newKey are required');
  try {
    const params = {
      ...getS3ThumbnailParams(newKey),
      CopySource: `${s3ThumbnailBucketName}/${getThumbnailObjectKey(oldKey)}`
    };
    const command = new CopyObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    logger.error(error);
    const { requestId, cfId, extendedRequestId } = error.$metadata || {};
    logger.error({
      message: 'copyThumbnailObject',
      requestId,
      cfId,
      extendedRequestId
    });
    throw error;
  }
};

exports.deleteVideoByKey = async key => {
  if (!key) throw new Error('Key is required');
  try {
    const params = getS3VideoParams(key);
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    logger.error(error);
    const { requestId, cfId, extendedRequestId } = error.$metadata || {};
    logger.error({
      message: 'deleteVideoByKey',
      requestId,
      cfId,
      extendedRequestId
    });
    throw error;
  }
};

exports.deleteThumbnailByKey = async key => {
  if (!key) throw new Error('Key is required');
  try {
    const params = getS3ThumbnailParams(key);
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    logger.error(error);
    const { requestId, cfId, extendedRequestId } = error.$metadata || {};
    logger.error({
      message: 'deleteThumbnailByKey',
      requestId,
      cfId,
      key,
      extendedRequestId
    });
    throw error;
  }
};

/**
 * Image helper functions
 */

const getCoverImageObjectKey = key => {
  return `${key}.${MEDIA.DEFAULT_COVERIMAGE_FILE_EXTENTION}`;
};

const getS3CoverImageParams = key => {
  return {
    Bucket: s3CoverImageBucketName,
    ...(key && {
      Key: getCoverImageObjectKey(key)
    })
  };
};

exports.getCoverImageDistributionURI = key => {
  return `${coverImageDistributionURI}/${getCoverImageObjectKey(key)}`;
};

exports.getIsCoverImageBucketAvailable = async () => {
  try {
    const params = getS3CoverImageParams();
    const command = new HeadBucketCommand(params);
    await s3Client.send(command);
    return true; // Bucket exists and is accessible
  } catch (error) {
    logger.error(err);
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsCoverImageBucketAvailable',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.getIsCoverImageObjectAvailable = async key => {
  try {
    const params = getS3CoverImageParams(key);
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true; // Object exists
  } catch (error) {
    logger.error(err);
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsCoverImageObjectAvailable',
      requestId,
      cfId,
      key,
      extendedRequestId
    });
    return false; // Object does not exist
  }
};

exports.createCoverImageBucket = async () => {
  try {
    const params = getS3CoverImageParams();
    const command = new CreateBucketCommand(params);
    await s3Client.send(command);
    return `Bucket "${s3CoverImageBucketName}" has been created successfully.`;
  } catch (error) {
    logger.error(err);
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'createCoverImageBucket',
      requestId,
      cfId,
      extendedRequestId
    });
  }
};

exports.copyCoverImageObject = async (oldKey, newKey) => {
  if (!oldKey || !newKey)
    throw new Error('Both oldKey and newKey are required');
  try {
    const params = {
      ...getS3CoverImageParams(newKey),
      CopySource: `${s3CoverImageBucketName}/${getCoverImageObjectKey(oldKey)}`
    };
    const command = new CopyObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    logger.error(error);
    const { requestId, cfId, extendedRequestId } = error.$metadata || {};
    logger.error({
      message: 'copyCoverImageObject',
      requestId,
      cfId,
      oldKey,
      extendedRequestId
    });
    throw error;
  }
};

exports.deleteCoverImageByKey = async key => {
  if (!key) throw new Error('Key is required');
  try {
    const params = getS3CoverImageParams(key);
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    logger.error(error);
    const { requestId, cfId, extendedRequestId } = error.$metadata || {};
    logger.error({
      message: 'deleteCoverImageByKey',
      requestId,
      cfId,
      key,
      extendedRequestId
    });
    throw error;
  }
};
