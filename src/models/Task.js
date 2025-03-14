import mongoose from 'mongoose';
import { DIFFICULTY, STATUS } from '../constants';
import { isProductionEnvironment } from '../utilities/boolean';
import { generateUid } from '../utilities/token';

const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },
    taskId: {
      type: String,
      index: true,
      default: generateUid()
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    createdBy: {
      type: Number,
      required: true,
      index: true
    },
    assignedTo: {
      type: Number,
      required: true,
      index: true
    },
    points: {
      type: Number,
      required: true,
      default: 1
    },
    difficulty: {
      type: String,
      default: DIFFICULTY.MEDIUM
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: STATUS.INPROGRESS
    },
    completedAt: {
      type: Date
    },
    tags: {
      type: [String]
    },
    files: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
taskSchema.set('autoCreate', !isProductionEnvironment());

const Task = model('Task', taskSchema);

export default Task;
