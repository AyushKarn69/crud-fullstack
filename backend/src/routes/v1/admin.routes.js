// Routes for admin endpoints (user and task management)

import { Router } from "express";
import * as usersController from "../../modules/users/users.controller.js";
import * as adminController from "../../modules/admin/admin.controller.js";
import {
  listUsersSchema,
  deleteUserSchema,
  listAllTasksSchema,
} from "../../modules/admin/admin.schema.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: List all users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved
 */
router.get("/users", validate(listUsersSchema), usersController.listUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete user
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
 *         description: User deleted
 */
router.delete(
  "/users/:id",
  validate(deleteUserSchema),
  usersController.deleteUser
);

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     tags:
 *       - Admin
 *     summary: List all tasks across all users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All tasks retrieved
 */
router.get("/tasks", validate(listAllTasksSchema), adminController.listAllTasks);

export default router;
