// Quick test to verify MongoDB connection and Task model

import mongoose from 'mongoose';
import { Task } from './src/modules/tasks/task.model.js';

const MONGO_URI = 'mongodb://localhost:27017/taskdb';

async function testMongo() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');

    // Test creating a task
    console.log('Creating test task...');
    const task = await Task.create({
      userId: 'test-user-id',
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      dueDate: new Date('2024-12-31T23:59:59.000Z')
    });
    console.log('✅ Task created:', task);

    // Test finding tasks
    console.log('Finding tasks...');
    const tasks = await Task.find({ userId: 'test-user-id' });
    console.log('✅ Tasks found:', tasks.length);

    // Cleanup
    await Task.deleteMany({ userId: 'test-user-id' });
    console.log('✅ Test cleanup completed');

    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
    
    console.log('\n🎉 All tests passed! MongoDB integration is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testMongo();