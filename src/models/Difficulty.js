'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//Difficulty SCHEMA
//  ============================================
const difficultySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    value: {
      type: String,
      required: true
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
difficultySchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments difficultyId everytime an instances is created
 */
difficultySchema.plugin(autoIncrement, { inc_field: 'difficultyId' });

/**
 * Create difficulty model out of difficultySchema
 */
const Difficulty = model('Difficulty', difficultySchema);

export default Difficulty;
