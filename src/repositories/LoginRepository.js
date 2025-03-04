'use strict';

import logger from '../logger';
import models from '../models';

exports.getLogins = async userId => {
  try {
    const { Login } = models;
    const logins = await Login.find({ userId }).sort({ lastLoggedIn: -1 });
    if (logins) {
      return [null, logins];
    }
    return [new Error('Unable to find logins associated with user.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting login for user data to db: ${err.message}`);
    return [new Error('Unable to find logins associated with user.')];
  }
};

exports.updateLastLogin = async body => {
  try {
    const { Login } = models;
    const payload = {
      ...body,
      mfaAttemptTime: body.mfaRequired ? new Date() : null
    };
    const login = new Login(payload);
    const createdLogin = await login.save();
    return [null, createdLogin];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating login for user data to db: ${err.message}`);
    return [new Error('Unable to update login associated with user.')];
  }
};
