'use strict';

import winston from 'winston';

const { splat, combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ timestamp, level, message, ...rest }) => {
  const meta = rest.meta || rest[Symbol.for('splat')] || '';
  return `${timestamp} ${level}: ${message} ${
    meta ? JSON.stringify(meta) : ''
  }`;
});

const transports = [
  new winston.transports.Console({
    format: combine(colorize())
  })
];

if (process.env.NODE_ENV !== 'development') {
  transports.push(
    new winston.transports.File({
      filename: 'app.log',
      level: 'info',
      format: combine(timestamp(), splat(), myFormat)
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), splat(), myFormat),
  transports
});

export default logger;
