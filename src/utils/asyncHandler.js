const asyncHandler = (requestHandler) => {
  /**
   * Wraps an async request handler to catch errors and pass them to the next middleware.
   * @param {Function} requestHandler - The async request handler function.
   * @returns {Function} A middleware function that handles errors.
   */
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      // Handle any errors that occur in the async handler
      console.error("Error in async handler:", error); // Log the error for debugging
      res.status(500).json({ error: "Internal Server Error" }); // Send a generic error response
    });
  };
};

export { asyncHandler };
