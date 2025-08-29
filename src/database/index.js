'use strict';

import mongoose from 'mongoose';
import config from '../config';
import logger from '../logger';

const { CLUSTER_DOMAIN } = config.sources.database;

/**
 * Set event listener to mongoose.connection on error
 */
mongoose.connection.on('error', error => {
  logger.error(error);
});

/**
 * Set event listener to mongoose.connection on open
 */
mongoose.connection.on('open', () => {
  logger.info(`Connected to ${CLUSTER_DOMAIN}....`);
});

/**
 * Set event listener to mongoose.connection on disconnect
 */
mongoose.connection.on('disconnected', () => {
  logger.info(`Disconnected from ${CLUSTER_DOMAIN}....`);
});

/**
 * This warning message is indicating that the Mongoose library is currently using the "strictQuery" option and that this option will be switched back to "false" in Mongoose 7 by default.
 * Mongoose uses this option to determine whether to enforce strict query syntax. When set to "false", Mongoose will allow query conditions to match multiple properties.
 * To resolve this warning, you can either set "strictQuery" to "false" in your code by using the following line:
 */
mongoose.set('strictQuery', false);

/**
 * Mongoose singleton object to connect.
 */
const source = mongoose;

/**
 * Helper functions for the database
 */

const getDatabaseConnectionString = () => {
  //Generate database string url with environment variables
  const {
    CLUSTER_DOMAIN,
    DB_NAME,
    DB_PASS: dbPass,
    DB_USER: dbUser,
    DB_APP_NAME: dbAppName
  } = config.sources.database;
  return `mongodb+srv://${dbUser}:${dbPass}@${CLUSTER_DOMAIN}/${DB_NAME}?retryWrites=true&w=majority&appName=${dbAppName}`;
};

// Gracefully close active connections to db
const closeDatabaseConnections = async () => {
  logger.info('Disconnecting from database...');
  try {
    await source.disconnect();
    logger.info('Database disconnected.');
  } catch (err) {
    logger.error('Error disconnecting from database:', err);
    throw err;
  }
};

// Retry connection logic
const connectWithRetry = async (
  uri,
  options = {},
  retries = 5,
  delay = 2000
) => {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(
        `Attempting MongoDB connection (Attempt ${attempt}/${retries})...`
      );
      await source.connect(uri, options);
      logger.info('MongoDB connection established.');
      return;
    } catch (err) {
      lastError = err;
      logger.error(
        `MongoDB connection attempt ${attempt} failed: ${err.message}`
      );
      if (attempt < retries) {
        logger.info(`Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  logger.error('All MongoDB connection attempts failed.');
  throw lastError;
};

// Utility to wait for connection to be established
const waitForConnection = async (timeout = 10000) => {
  const start = Date.now();
  while (source.connection.readyState !== 1) {
    if (Date.now() - start > timeout) {
      throw new Error('Timed out waiting for MongoDB connection');
    }
    await new Promise(res => setTimeout(res, 100));
  }
};

// Drop all collections in the current database
const dropAllCollections = async () => {
  logger.info('Dropping all collections...');
  try {
    await source.connection.db.dropDatabase();
    logger.info('All collections dropped.');
  } catch (err) {
    logger.error('Error dropping collections:', err);
    throw err;
  }
};

// Utility to check if mongoose is connected
const isDatabaseConnected = () => source.connection.readyState === 1;

// Export helpers
export {
  closeDatabaseConnections,
  connectWithRetry,
  dropAllCollections,
  getDatabaseConnectionString,
  isDatabaseConnected,
  waitForConnection
};

export default source;
