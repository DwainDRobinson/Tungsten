'use strict';

import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import config from '../config';
import {
  DEFAULT_COVERIMAGE_FILE_EXTENTION,
  DEFAULT_THUMBNAIL_FILE_EXTENTION,
  DEFAULT_VIDEO_FILE_EXTENTION
} from '../constants';
import logger from '../logger';

const { aws } = config.sources;
const { region, signatureVersion, s3, cloudFront } = aws;
const {
  s3AccessKeyId,
  s3SecretAccessKey,
  s3VideoBucketName,
  s3ThumbnailBucketName,
  s3CoverImageBucketName
} = s3;

const {
  videoDistributionURI,
  thumbnailDistributionURI,
  coverImageDistributionURI
} = cloudFront;

// Create S3 service object
const s3Client = new S3Client({
  region,
  signatureVersion,
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey
  }
});

/**
 * Video helper functions
 */
const getVideoObjectKey = key => {
  return `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`;
};

const getThumbnailObjectKey = key => {
  return `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`;
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

exports.copyVideoObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...getS3VideoParams(newKey),
        CopySource: `${s3VideoBucketName}/${getVideoObjectKey(oldKey)}`
      };
      const command = new CopyObjectCommand(params);
      await s3Client.send(command);
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyVideoObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.copyThumbnailObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...getS3ThumbnailParams(newKey),
        CopySource: `${s3ThumbnailBucketName}/${getThumbnailObjectKey(oldKey)}`
      };
      const command = new CopyObjectCommand(params);
      await s3Client.send(command);
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyThumbnailObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.deleteVideoByKey = key => {
  return new Promise((resolve, reject) => {
    try {
      const params = getS3VideoParams(key);
      const command = new DeleteObjectCommand(params);
      s3Client.send(command);
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteVideoByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.deleteThumbnailByKey = key => {
  return new Promise((resolve, reject) => {
    try {
      const params = getS3ThumbnailParams(key);
      const command = new DeleteObjectCommand(params);
      s3Client.send(command);
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteThumbnailByKey',
        requestId,
        cfId,
        key,
        extendedRequestId
      });
      reject(err);
    }
  });
};

/**
 * Image helper functions
 */

const getCoverImageObjectKey = key => {
  return `${key}.${DEFAULT_COVERIMAGE_FILE_EXTENTION}`;
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


exports.copyCoverImageObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...getS3CoverImageParams(newKey),
        CopySource: `${s3CoverImageBucketName}/${getCoverImageObjectKey(
          oldKey
        )}`
      };
      const command = new CopyObjectCommand(params);
      await s3Client.send(command);
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyCoverImageObject',
        requestId,
        cfId,
        oldKey,
        extendedRequestId
      });
      reject(err);
    }
  });
};


exports.deleteCoverImageByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = getS3CoverImageParams(key);
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteCoverImageByKey',
        requestId,
        cfId,
        key,
        extendedRequestId
      });
      reject(err);
    }
  });
};
