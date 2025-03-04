'use strict';

import config from '../config';

const { APP_NAME } = config;

const BASE_URL = `/${APP_NAME}-service`;

const CUSTOM_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const PASSWORD_RESET_REQUEST_SUBJECT = 'Password Reset Request';

const PASSWORD_RESET_SUCCESS_SUBJECT = 'Password Reset Successfully';

const STRONG_PASSWORD_VALIDATIONS_REGEX =
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$';

const PASSWORD_VALIDATION_MESSAGE =
  'Please enter a password at least 8 characters, at least one uppercase letter, one lowercase letter, and one special character.';

const DEFAULT_VIDEO_FILE_EXTENTION = 'mp4';

const DEFAULT_THUMBNAIL_FILE_EXTENTION = 'jpeg';

const DEFAULT_COVERIMAGE_FILE_EXTENTION = 'jpeg';

export {
  BASE_URL,
  CUSTOM_ALPHABET,
  DEFAULT_COVERIMAGE_FILE_EXTENTION,
  DEFAULT_THUMBNAIL_FILE_EXTENTION,
  DEFAULT_VIDEO_FILE_EXTENTION,
  PASSWORD_RESET_REQUEST_SUBJECT,
  PASSWORD_RESET_SUCCESS_SUBJECT,
  PASSWORD_VALIDATION_MESSAGE,
  STRONG_PASSWORD_VALIDATIONS_REGEX
};
