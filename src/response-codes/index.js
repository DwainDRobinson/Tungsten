'use strict';

const HttpStatusCodes = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
});

const statusMessages = {
  [HttpStatusCodes.OK]: 'Success',
  [HttpStatusCodes.CREATED]: 'Created',
  [HttpStatusCodes.ACCEPTED]: 'Accepted',
  [HttpStatusCodes.NO_CONTENT]: 'No Content',
  [HttpStatusCodes.BAD_REQUEST]: 'Bad Request',
  [HttpStatusCodes.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatusCodes.FORBIDDEN]: 'Forbidden',
  [HttpStatusCodes.NOT_FOUND]: 'Not Found',
  [HttpStatusCodes.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HttpStatusCodes.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HttpStatusCodes.NOT_IMPLEMENTED]: 'Not Implemented',
  [HttpStatusCodes.BAD_GATEWAY]: 'Bad Gateway',
  [HttpStatusCodes.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HttpStatusCodes.GATEWAY_TIMEOUT]: 'Gateway Timeout'
};

const getStatusMessage = statusCode =>
  statusMessages[statusCode] || 'Unknown status code';

const errorResponse = (statusCode, message) => [
  statusCode,
  {
    errors: [
      {
        value: getStatusMessage(statusCode),
        msg: message
      }
    ]
  }
];

const badRequest = message =>
  errorResponse(HttpStatusCodes.BAD_REQUEST, message);
const unauthorizedRequest = message =>
  errorResponse(HttpStatusCodes.UNAUTHORIZED, message);
const forbiddenRequest = message =>
  errorResponse(HttpStatusCodes.FORBIDDEN, message);
const notFoundRequest = message =>
  errorResponse(HttpStatusCodes.NOT_FOUND, message);
const internalServerErrorRequest = message =>
  errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, message);

export {
  HttpStatusCodes,
  badRequest,
  forbiddenRequest,
  getStatusMessage,
  internalServerErrorRequest,
  notFoundRequest,
  unauthorizedRequest
};
