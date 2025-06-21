class apiError extends Error {
  constructor(
    message = "Something went wrong",
    statusCode,
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates that this error is expected and can be handled
    this.message = message; // The error message
    this.success = false; // Indicates that the operation was not successful
    this.errors = errors;

    if (stack) {
      this.stack = stack; // Additional error details, if any
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { apiError }; // Export the apiError class for use in other modules
// This class extends the built-in Error class to create a custom error type for API errors.
// It includes a status code and a flag to indicate if the error is operational (expected).
// The constructor takes a message and a status code, initializing the error with these values.
// The `isOperational` property is set to true to indicate that this error is expected and can be handled gracefully.
// This allows for better error handling in API responses, distinguishing between operational errors and unexpected ones.
// This code defines a custom error class for API errors, extending the built-in Error class.
