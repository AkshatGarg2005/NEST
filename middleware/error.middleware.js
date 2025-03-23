export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  // Log error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    statusCode,
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  })

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  })
}

