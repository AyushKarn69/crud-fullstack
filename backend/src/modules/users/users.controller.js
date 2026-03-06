// User management route handlers for admin operations

import * as usersService from "./users.service.js";
import { sendSuccess } from "../../utils/response.js";

export const listUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const { users, meta } = await usersService.listUsersService(page, limit);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      meta,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await usersService.deleteUserService(id);

    sendSuccess(res, {}, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
