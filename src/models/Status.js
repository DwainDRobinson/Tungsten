'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//STATUS SCHEMA
//  ============================================
const statusSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
statusSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments statusId everytime an instances is created
 */
statusSchema.plugin(autoIncrement, { inc_field: 'statusId' });

/**
 * Create Status model out of statusSchema
 */
const Status = model('Status', statusSchema);

export default Status;
