// Zod schema validation wrapper middleware

import { sendError } from "../utils/response.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return sendError(res, "Validation failed", 400, errors);
    }
  };
};

export default validate;
