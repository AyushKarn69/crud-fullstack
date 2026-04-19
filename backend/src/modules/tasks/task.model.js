// Mongoose schema for Task — stored in MongoDB

import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
  {
    userId: {
      type: String,         // PostgreSQL UUID stored as string — bridges the two DBs
      required: true,
      index: true,          // every query filters by this, index is essential
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed'],
        message: 'Status must be pending or completed',
      },
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Task = model('Task', taskSchema);