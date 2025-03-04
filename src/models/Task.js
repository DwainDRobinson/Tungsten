import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    assignedTo: {
      type: Number,
      required: true,
      index: true
    },
    points: {
      type: Number,
      required: true,
      min: 0
    },
    tags: {
      type: [String],
      required: true
    },
    difficulty: {
      type: String,
      default: 'Medium'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: 'Pending'
    },
    expirationDate: {
      type: Date
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
taskSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments taskId everytime an instances is created
 */
taskSchema.plugin(autoIncrement, { inc_field: 'taskId' });

/**
 * Creates index in database for taskId
 */
taskSchema.index({ taskId: 1 });

const Task = model('Task', taskSchema);

export default Task;
