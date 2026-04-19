// Task business logic — reads/writes to MongoDB via Mongoose

import { Task } from './task.model.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// ── Create ──────────────────────────────────────────────
export const createTaskService = async (userId, title, description, status) => {
  const task = await Task.create({
    userId,
    title,
    description: description || '',
    status: status || 'pending',
  });

  return task;
};

// ── List (paginated + status filter) ────────────────────
export const listTasksService = async (userId, role, page, limit, status) => {
  const pageNum = Math.max(1, parseInt(page) || DEFAULT_PAGE);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || DEFAULT_LIMIT));
  const skip = (pageNum - 1) * limitNum;

  const filter = role === "ADMIN" ? {} : { userId };
  if (status && status !== 'ALL') {
    filter.status = status;
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    meta: { page: pageNum, limit: limitNum, total },
  };
};

// ── Get one ──────────────────────────────────────────────
export const getTaskService = async (taskId, userId, role) => {
  const filter = role === "ADMIN" ? { _id: taskId } : { _id: taskId, userId };
  const task = await Task.findOne(filter);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  return task;
};

// ── Update (partial) ─────────────────────────────────────
export const updateTaskService = async (taskId, userId, role, updates) => {
  const filter = role === "ADMIN" ? { _id: taskId } : { _id: taskId, userId };
  const task = await Task.findOne(filter);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  // Whitelist — prevents mass-assignment (e.g. someone POSTing { userId: "other-id" })
  const allowed = ['title', 'description', 'dueDate', 'status'];
  allowed.forEach(field => {
    if (updates[field] !== undefined) {
      task[field] = field === 'dueDate' && updates[field] ? new Date(updates[field]) : updates[field];
    }
  });

  await task.save(); // runs schema validators on save
  return task;
};

// ── Delete ───────────────────────────────────────────────
export const deleteTaskService = async (taskId, userId, role) => {
  const filter = role === "ADMIN" ? { _id: taskId } : { _id: taskId, userId };
  const task = await Task.findOne(filter);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  await Task.findOneAndDelete(filter);
  return { message: "Task deleted successfully" };
};

// ── Admin: all tasks across all users ────────────────────
export const getAllTasksAdmin = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments({}),
  ]);
  return { tasks, meta: { page, limit, total } };
};

// ── Admin: delete all tasks for a user (called before deleting user) ──
export const deleteTasksByUser = async (userId) => {
  await Task.deleteMany({ userId });
};
