// JWT token verification and user extraction middleware

import { verifyAccessToken } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Missing or invalid authorization header", 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return sendError(res, "Invalid or expired access token", 401);
  }

  req.user = payload;
  next();
};

export default authenticate;
