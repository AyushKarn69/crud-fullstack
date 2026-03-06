// Standardized response formatter for consistent API responses

export const sendSuccess = (res, data, message = "", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = "", statusCode = 400, errors = []) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
