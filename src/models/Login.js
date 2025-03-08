'use strict';

import mongoose from 'mongoose';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;

//LOGIN SCHEMA
//  ============================================
const loginSchema = new Schema({
  email: {
    type: Number,
    required: true,
    index: true
  },
  asignedTo: {
    type: Number,
    index: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  lastLoggedIn: {
    type: Date,
    default: Date.now
  },
  result: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true
  },
  failureReason: {
    type: String
  },
  mfaRequired: {
    type: Boolean,
    default: false
  },
  mfaMethod: {
    type: String,
    enum: ['SMS', 'EMAIL', 'APP'],
    default: null
  },
  mfaVerified: {
    type: Boolean,
    default: false
  },
  mfaAttemptTime: {
    type: Date
  }
});

/**
 * Set the autoCreate option on models if not on production
 */
loginSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Set the TTL index for the `lastLoggedIn` field to expire.
 */
loginSchema.index(
  { lastLoggedIn: 1 },
  { expireAfterSeconds: 180 * 24 * 60 * 60 }
); // 180 days in seconds

/**
 * Create Code model out of loginSchema
 */
const Login = model('Login', loginSchema);

export default Login;
