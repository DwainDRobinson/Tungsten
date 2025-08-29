'use strict';

import config from './config';
import source, {
  closeDatabaseConnections,
  getDatabaseConnectionString
} from './database';
import logger from './logger';
import seedData from './seed';
import server from './server';
import { getCurrentUTCTimestampFormatted } from './utilities/time';

const gracefulExit = () => {
  // Gracefully shuts down application by disconnecting from all active connections to db and then setting process.exitCode
  logger.info('Shutting down application.');
  closeDatabaseConnections().then(() => {
    process.exitCode = 0;
  });
};

/**
 * Connects to database
 */
const initializeDBConnection = async () => {
  const { options } = config.sources.database;
  try {
    logger.info('Connecting to database...');
    const start = Date.now();
    await source.connect(getDatabaseConnectionString(), options);
    logger.info(`Database connected in ${Date.now() - start}ms.`);
  } catch (e) {
    logger.error(`Error connecting to db: ${e}`);
    throw e;
  }
};

/**
 * Seeds data into the database
 */
const initializeSeedData = async () => {
  try {
    logger.info('Seeding database...');
    const start = Date.now();
    await seedData();
    logger.info(`Database seeded successfully in ${Date.now() - start}ms.`);
  } catch (e) {
    logger.error(`Error seeding data into db: ${e}`);
    throw e;
  }
};

/**
 * Starts web server
 */
const startServer = async () => {
  const { PORT, HOST } = config;
  try {
    logger.info('Starting server...');
    await new Promise((resolve, reject) => {
      server.listen(PORT, HOST, err => {
        if (err) return reject(err);
        resolve();
      });
    });
    logger.info(`Server listening at http://${HOST}:${PORT}`);
  } catch (err) {
    logger.error(`Server failed to start: ${err}`);
    throw err;
  }
};

/**
 * Start web application
 */

// Main entry point
const runApplication = async () => {
  const { APP_NAME } = config;
  logger.info(`Starting ${APP_NAME} app...`);
  await initializeDBConnection();
  await initializeSeedData();
  await startServer();
};

runApplication().catch(err => {
  logger.error(`Error starting application: ${err.message}`);
});

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    logger.error(`Unhandled rejection, reason: ${reason.stack} `);
  })
  .on('uncaughtException', err => {
    console.error(
      `${getCurrentUTCTimestampFormatted()} uncaughtException: ${err.message}`
    );
    logger.error(`Uncaught exception thrown: ${err.message}`);
    logger.info(
      'Disconnecting from database and shutting down application from uncaughtException.'
    );
    closeDatabaseConnections().then(() => {
      process.exit(1);
    });
  })
  .on('SIGINT', gracefulExit)
  .on('SIGTERM', gracefulExit);
