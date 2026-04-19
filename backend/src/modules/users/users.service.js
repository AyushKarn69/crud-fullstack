// User management business logic for admin operations

import prisma from "../../config/db.js";
import { deleteTasksByUser } from "../tasks/tasks.service.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const listUsersService = async (page, limit) => {
  const pageNum = Math.max(1, parseInt(page) || DEFAULT_PAGE);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || DEFAULT_LIMIT));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
  ]);

  return { users, meta: { page: pageNum, limit: limitNum, total } };
};

export const deleteUserService = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Delete MongoDB tasks first, then PostgreSQL user
  await deleteTasksByUser(userId);
  await prisma.user.delete({ where: { id: userId } });

  return { message: "User deleted successfully" };
};
