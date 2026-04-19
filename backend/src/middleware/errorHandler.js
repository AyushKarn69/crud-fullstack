// Global error handler middleware for standardized error responses

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose: malformed ObjectId in URL param (e.g. /tasks/not-valid)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      errors: [{ field: err.path, message: `${err.value} is not a valid ID` }],
    });
  }

  // Mongoose: schema validation failure (e.g. invalid status value)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors 
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

export default errorHandler;
