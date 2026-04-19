// Zod validation schemas for task routes

import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional()
      .or(z.literal('')),
    dueDate: z
      .string()
      .datetime({ message: 'dueDate must be a valid ISO 8601 date' })
      .optional()
      .or(z.literal('')),
    status: z
      .enum(['pending', 'completed'], {
        errorMap: () => ({ message: 'Status must be pending or completed' }),
      })
      .optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Invalid task ID"),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional().or(z.literal('')),
    dueDate: z.string().datetime().optional().or(z.literal('')),
    status: z.enum(['pending', 'completed']).optional(),
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Invalid task ID"),
  }),
});

export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Invalid task ID"),
  }),
});

export const listTasksSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    status: z.enum(['pending', 'completed']).optional(),
  }),
});
