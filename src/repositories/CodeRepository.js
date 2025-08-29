'use strict';

import logger from '../logger';
import models from '../models';

// Check if code exists for a userId
const doesCodeByUserIdExist = async userId => {
  if (!userId) return null;
  try {
    const { Code } = models;
    return await Code.findOne({ userId }).lean();
  } catch (err) {
    logger.error(`Error getting code data from db by userId: ${err.message}`);
    return null;
  }
};

// Find code by userId
const findCodeByUserId = async userId => {
  if (!userId) return null;
  try {
    const { Code } = models;
    return await Code.findOne({ userId }).lean();
  } catch (err) {
    logger.error(`Error getting code data from db by userId: ${err.message}`);
    return null;
  }
};

// Find code by email
const findCodeByEmail = async email => {
  if (!email) return null;
  try {
    const { Code } = models;
    return await Code.findOne({ email }).lean();
  } catch (err) {
    logger.error(`Error getting code data from db by email: ${err.message}`);
    return null;
  }
};

// Get code by userId
exports.getCode = async userId => {
  if (!userId) return [new Error('User ID is required.')];
  try {
    const code = await findCodeByUserId(userId);
    if (code) {
      return [null, code];
    }
    return [new Error('Unable to find code associated with user.')];
  } catch (err) {
    logger.error(`Error getting code for userId from db: ${err.message}`);
    return [new Error('Unable to find code associated with user.')];
  }
};

// Verify OTP code by email
exports.verifyOTPCode = async (email, otpCode) => {
  if (!email || !otpCode)
    return [new Error('Email and OTP code are required.')];
  try {
    const code = await findCodeByEmail(email);
    if (code && code.otpCode === otpCode) {
      return [null, true];
    }
    return [new Error('Unable to find code to verify.')];
  } catch (err) {
    logger.error(`Error verifying otpCode: ${otpCode}: ${err.message}`);
    return [new Error('Unable to verify code')];
  }
};

// Create a new OTP code
exports.createOTPCode = async payload => {
  if (!payload || !payload.userId) return [new Error('User ID is required.')];
  try {
    const { Code } = models;
    const { userId } = payload;
    const existingCode = await doesCodeByUserIdExist(userId);
    if (!existingCode) {
      const newCode = new Code(payload);
      const createdCode = await newCode.save();
      return [null, createdCode];
    }
    return [new Error('Code with the userId provided exists and active.')];
  } catch (err) {
    logger.error(`Error creating code data to db: ${err.message}`);
    return [new Error('Unable to create code to db.')];
  }
};

// Delete code by userId
exports.deleteCode = async userId => {
  if (!userId) return [new Error('User ID is required.')];
  try {
    const { Code } = models;
    const deletedCode = await Code.deleteOne({ userId });
    if (deletedCode.deletedCount > 0) {
      return [null, deletedCode];
    }
    return [new Error('Unable to find code to delete details.')];
  } catch (err) {
    logger.error(`Error deleting code data from db: ${err.message}`);
    return [new Error('Unable to find code to delete details.')];
  }
};
