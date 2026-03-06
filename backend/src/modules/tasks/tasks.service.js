// Task management business logic: CRUD operations with pagination

import prisma from "../../config/db.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const listTasksService = async (userId, role, page, limit, status) => {
  const pageNum = Math.max(1, parseInt(page) || DEFAULT_PAGE);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || DEFAULT_LIMIT));
  const skip = (pageNum - 1) * limitNum;

  const whereClause =
    role === "ADMIN" ? { ...(status && { status }) } : { userId, ...(status && { status }) };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where: whereClause }),
  ]);

  return {
    tasks,
    meta: { page: pageNum, limit: limitNum, total },
  };
};

export const createTaskService = async (userId, title, description, status) => {
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "PENDING",
      userId,
    },
  });

  return task;
};

export const getTaskService = async (taskId, userId, role) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (role !== "ADMIN" && task.userId !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return task;
};

export const updateTaskService = async (taskId, userId, role, updates) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (role !== "ADMIN" && task.userId !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updates,
  });

  return updatedTask;
};

export const deleteTaskService = async (taskId, userId, role) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (role !== "ADMIN" && task.userId !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  await prisma.task.delete({ where: { id: taskId } });

  return { message: "Task deleted successfully" };
};
