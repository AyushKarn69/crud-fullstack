// Authentication business logic: register, login, refresh token, logout

import prisma from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";

export const registerService = async (email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  return { id: user.id, email: user.email, role: user.role };
};

export const loginService = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);
  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

export const refreshService = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const newAccessToken = signAccessToken({ id: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user.id });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
