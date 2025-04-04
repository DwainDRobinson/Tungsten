'use strict';

import { S3Client } from '@aws-sdk/client-s3';
import config from '../../config';

const { aws } = config.sources;
const { region, signatureVersion, s3 } = aws;
const { s3AccessKeyId, s3SecretAccessKey } = s3;

// Create S3 service object
const s3Client = new S3Client({
  region,
  signatureVersion,
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey
  }
});

export default s3Client;
