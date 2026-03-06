// Authentication route handlers for register, login, refresh, logout

import * as authService from "./auth.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerService(email, password);
    sendSuccess(res, user, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.loginService(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { accessToken, user }, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return sendError(res, "Refresh token not found", 401);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshService(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { accessToken }, "Token refreshed successfully");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    sendSuccess(res, {}, "Logout successful");
  } catch (error) {
    next(error);
  }
};
