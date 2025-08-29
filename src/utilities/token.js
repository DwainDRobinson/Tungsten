'use strict';

import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';

const { sign, verify } = jwt;
const { auth } = config;
const { JWT_SECRET, TOKEN_EXPIRY } = auth;

const CUSTOM_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateAuthorizationToken = user => {
  const { email, fullName, role, userId } = user;
  const expiresIn = dayjs().add(TOKEN_EXPIRY, 'minute').unix();
  const payload = { email, fullName, role, userId };
  try {
    return sign({ ...payload, exp: expiresIn }, JWT_SECRET);
  } catch (err) {
    console.error('Error generating authorization token:', err);
    return undefined;
  }
};

const verifyJWTToken = token => {
  try {
    const decoded = verify(token, JWT_SECRET);
    if (decoded) {
      return decoded;
    }
    return undefined;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

const nanoid6 = customAlphabet(CUSTOM_ALPHABET, 6);

const generateOTPCode = () => nanoid6();

const generateUid = () => uuidv4();

export {
  generateAuthorizationToken,
  generateOTPCode,
  generateUid,
  verifyJWTToken
};
