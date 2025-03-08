'use strict';

import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import config from '../config';

const { sign, verify } = jwt;
const { auth } = config;
const { JWT_SECRET, TOKEN_EXPIRY } = auth;

const CUSTOM_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateAuthorizationToken = user => {
  const { email, fullName, role, userId } = user;

  const expiresIn = dayjs().add(TOKEN_EXPIRY, 'minute').unix();
  const payload = {
    email,
    fullName,
    role,
    userId
  };

  try {
    return sign({ ...payload, exp: expiresIn }, JWT_SECRET);
  } catch {
    console.error(err);
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

const generateOTPCode = () => {
  return customAlphabet(CUSTOM_ALPHABET, 6)();
};

export { generateAuthorizationToken, generateOTPCode, verifyJWTToken };
