'use strict';

import mongoose from 'mongoose';
import { isProductionEnvironment } from '../utilities/boolean';
import { generateUid } from '../utilities/token';

const { Schema, model } = mongoose;

//CATEGORY SCHEMA
//  ============================================
const categorySchema = new Schema(
  {
    categoryId: {
      type: String,
      index: true,
      unique: true,
      default: () => generateUid()
    },
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
categorySchema.set('autoCreate', !isProductionEnvironment());

/**
 * Create Category model out of categorySchema
 */
const Category = model('Category', categorySchema);

export default Category;
