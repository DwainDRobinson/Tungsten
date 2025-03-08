import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { isProductionEnvironment } from '../utilities/boolean';

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
      default: uuidv4()
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
    tags: {
      type: [String]
    },
    points: {
      type: Number,
      required: true,
      default: 1
    },
    difficulty: {
      type: String,
      default: 'MEDIUM'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: 'PENDING'
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

const Task = model('Task', taskSchema);

export default Task;
