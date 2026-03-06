// Routes for task management endpoints (CRUD operations)

import { Router } from "express";
import * as tasksController from "../../modules/tasks/tasks.controller.js";
import {
  createTaskSchema,
  updateTaskSchema,
  getTaskSchema,
  deleteTaskSchema,
  listTasksSchema,
} from "../../modules/tasks/tasks.schema.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";

const router = Router();

router.use(authenticate);
router.use(authorize("USER", "ADMIN"));

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: List user tasks with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved
 */
router.get("/", validate(listTasksSchema), tasksController.listTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/", validate(createTaskSchema), tasksController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get single task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task retrieved
 *       404:
 *         description: Task not found
 */
router.get("/:id", validate(getTaskSchema), tasksController.getTask);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Update task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task updated
 */
router.patch("/:id", validate(updateTaskSchema), tasksController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/:id", validate(deleteTaskSchema), tasksController.deleteTask);

export default router;
