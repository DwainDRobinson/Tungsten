'use strict';

import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import config from '../config';

const { aws } = config.sources;
const { region } = aws;

// Create Secrets Manager service object
const secretsManagerClient = new SecretsManagerClient({ region });

export default secretsManagerClient;
