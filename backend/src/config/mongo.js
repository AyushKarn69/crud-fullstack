// Manages MongoDB connection via Mongoose

import mongoose from 'mongoose';
import env from './env.js';

export const connectMongo = async () => {
  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('✅ MongoDB connected');
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();
};