// Zod validation schemas for task routes

import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid task ID"),
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").max(255).optional(),
    description: z.string().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid task ID"),
  }),
});

export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid task ID"),
  }),
});

export const listTasksSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
  }),
});
