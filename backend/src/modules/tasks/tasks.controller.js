// Task route handlers for CRUD operations

import * as tasksService from "./tasks.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const listTasks = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const { id, role } = req.user;

    const { tasks, meta } = await tasksService.listTasksService(
      id,
      role,
      page,
      limit,
      status
    );

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
      meta,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const { id } = req.user;

    const task = await tasksService.createTaskService(
      id,
      title,
      description,
      status
    );

    sendSuccess(res, task, "Task created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const { id: taskId } = req.params;
    const { id, role } = req.user;

    const task = await tasksService.getTaskService(taskId, id, role);

    sendSuccess(res, task, "Task retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id: taskId } = req.params;
    const { id, role } = req.user;
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== undefined)
    );

    const task = await tasksService.updateTaskService(taskId, id, role, updates);

    sendSuccess(res, task, "Task updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id: taskId } = req.params;
    const { id, role } = req.user;

    await tasksService.deleteTaskService(taskId, id, role);

    sendSuccess(res, {}, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
};
