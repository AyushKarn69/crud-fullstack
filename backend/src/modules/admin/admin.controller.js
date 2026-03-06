// Admin route handlers for viewing all tasks

import prisma from "../../config/db.js";
import { sendSuccess } from "../../utils/response.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const listAllTasks = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNum = Math.max(1, parseInt(page) || DEFAULT_PAGE);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || DEFAULT_LIMIT));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take: limitNum,
        include: {
          user: {
            select: { email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count(),
    ]);

    res.status(200).json({
      success: true,
      message: "All tasks retrieved successfully",
      data: tasks,
      meta: { page: pageNum, limit: limitNum, total },
    });
  } catch (error) {
    next(error);
  }
};
