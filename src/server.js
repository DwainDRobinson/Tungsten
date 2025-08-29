'use strict';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import noCache from 'nocache';
import responseTime from 'response-time';

import config from './config';
import logger from './logger';
import { rateLimitHandler } from './middlewares';
import {
  activityRouter,
  authRouter,
  categoryRouter,
  difficultyRouter,
  loginRouter,
  mainRouter,
  notFoundRouter,
  permissionRouter,
  roleRouter,
  statusRouter,
  tagRouter,
  userRouter
} from './routers';
import { isProductionEnvironment } from './utilities/boolean';

const BASE_URL = `/${config.APP_NAME}-service`;

// Create the Express application object
const server = express();

//BodyParser middleware
server.use(express.urlencoded({ limit: '50Mb', extended: false }));
server.use(express.json({ limit: '50Mb' }));
logger.info('Loaded body-parser middleware.');

// Response time middleware
server.use(responseTime());
logger.info('Loaded response time middleware.');

//Cors middleware
server.use(
  cors({
    credentials: true // Allow cookies and authentication headers
  })
);
logger.info('CORS enabled.');

if (isProductionEnvironment()) {
  // specify a single subnet
  server.set('trust proxy', config.TRUST_PROXY);
  logger.info('Proxy setting enabled.');

  //Helmet middleware
  server.use(helmet());
  server.use(
    helmet({
      xPoweredBy: false
    })
  );

  server.disable('x-powered-by');
  logger.info('Loaded helmet middleware.');

  //No cache middleware
  server.use(noCache());
  logger.info('Loaded no-cache middleware.');

  //Compression middleware
  server.use(compression());
  logger.info('Loaded compression middleware.');

  server.use(rateLimitHandler());
  logger.info('Loaded rate limit middleware.');
}

// Register all routers with logging
const routeLogMap = [
  [mainRouter, 'main'],
  [roleRouter, 'role'],
  [permissionRouter, 'permission'],
  [authRouter, 'auth'],
  [loginRouter, 'login'],
  [userRouter, 'user'],
  [tagRouter, 'tag'],
  [categoryRouter, 'category'],
  [difficultyRouter, 'difficulty'],
  [statusRouter, 'status'],
  [activityRouter, 'activity']
];
for (const [router, name] of routeLogMap) {
  server.use(BASE_URL, router);
  logger.info(`Loaded ${name} routes middleware.`);
}

server.use(notFoundRouter);
logger.info('Loaded not found routes middleware.');

export default http.createServer(server);
