const logger = require("../utils/logger");

exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const logMessage = `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;

  // Log full error in development, sanitized in production
  if (process.env.NODE_ENV === "development") {
    logger.error(logMessage);
    console.error(err.stack);
  } else {
    logger.error(logMessage);
  }

  // Never expose stack traces in production
  const errorResponse = {
    status: err.status,
    message: err.message,
  };

  // Additional details for validation errors
  if (err.errors) {
    errorResponse.errors = Object.values(err.errors).map((el) => el.message);
  }

  res.status(err.statusCode).json(errorResponse);
};
