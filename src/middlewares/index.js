'use strict';

import rateLimit from 'express-rate-limit';
import config from '../config';
import { EntitlementErrorMessages, TokenErrorMessages } from '../enums';
import logger from '../logger';
import { UserRepository } from '../repositories';
import {
  HttpStatusCodes,
  forbiddenRequest,
  getStatusMessage,
  internalServerErrorRequest,
  unauthorizedRequest
} from '../response-codes';
import { EntitlementService } from '../services';
import {
  isDevelopmentEnvironment,
  isProductionEnvironment
} from '../utilities/boolean';
import { verifyJWTToken } from '../utilities/token';
import { errorFormatter, validationResult } from '../validations';

const { RATE_LIMIT_MS, RATE_LIMIT_MAX } = config;

const requestResponseHandler = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.on('finish', () => {
    logger.info(
      `${res.statusCode} ${res.statusMessage}; ${res.get('X-Response-Time')} ${
        res.get('Content-Length') || 0
      }b sent`
    );
  });
  next();
};

const errorHandler = (err, req, res, next) => {
  if (err) logger.error(`Error: ${err.stack}`);
  res.status(err.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    error: isProductionEnvironment()
      ? getStatusMessage(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      : err.message
  });
};

const rateLimitHandler = () =>
  rateLimit({
    windowMs: RATE_LIMIT_MS,
    max: RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many calls made from this specific IP, please try again later'
  });

const validationHandler = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  next();
};

const validateAuthorizationTokenHandler = async (req, res, next) => {
  if (isDevelopmentEnvironment()) return next();
  const authorizationHeader = req.get('Authorization');
  if (!authorizationHeader) {
    const [statusCode, response] = unauthorizedRequest(
      TokenErrorMessages.MISSING_ACCESS_TOKEN
    );
    return res.status(statusCode).send(response);
  }
  // Expect: Bearer <token>
  const tokenParts = authorizationHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    const [statusCode, response] = unauthorizedRequest(
      TokenErrorMessages.INVALID_AUTHORIZATION_FORMAT
    );
    return res.status(statusCode).send(response);
  }
  try {
    const token = tokenParts[1];
    const result = verifyJWTToken(token);
    if (!result) {
      const [statusCode, response] = forbiddenRequest(
        TokenErrorMessages.UNAUTHORIZED_TOKEN_PROVIDED
      );
      return res.status(statusCode).send(response);
    }
    const { email } = result.data;
    const [error, user] = await UserRepository.getUserByEmail(email);
    if (!user || error) {
      const [statusCode, response] = forbiddenRequest(
        TokenErrorMessages.INVALID_TOKEN_METADTA
      );
      return res.status(statusCode).send(response);
    }
    req.user = result.data;
    return next();
  } catch (err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      const [statusCode, response] = forbiddenRequest(
        TokenErrorMessages.TOKEN_EXPIRATION
      );
      return res.status(statusCode).send(response);
    }
    const [statusCode, response] = forbiddenRequest(
      TokenErrorMessages.AUTHENICATION_ERROR
    );
    return res.status(statusCode).send(response);
  }
};

const hasPermissionHandler = requiredPermissions => async (req, res, next) => {
  if (isDevelopmentEnvironment()) return next();
  try {
    const { user } = req;
    const { email } = user;
    const [error, existingUser] = await UserRepository.getUserByEmail(email);
    if (error || !existingUser) {
      const message =
        error && error.message
          ? error.message
          : 'User not found or error occurred';
      const [statusCode, response] = forbiddenRequest(message);
      return res.status(statusCode).send(response);
    }
    const { permissions } = existingUser;
    const doesUserHasPermission = EntitlementService.checkPermissions(
      requiredPermissions,
      permissions
    );
    if (!doesUserHasPermission) {
      const [statusCode, response] = forbiddenRequest(
        EntitlementErrorMessages.USER_UNAUTHORIZED
      );
      return res.status(statusCode).send(response);
    }
    delete req.user;
    return next();
  } catch (err) {
    console.error(err);
    const message = isProductionEnvironment()
      ? getStatusMessage(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      : err.message;
    const [statusCode, response] = internalServerErrorRequest(message);
    return res.status(statusCode).send(response);
  }
};

// Exported middlewares
export {
  errorHandler,
  hasPermissionHandler,
  rateLimitHandler,
  requestResponseHandler,
  validateAuthorizationTokenHandler,
  validationHandler
};
