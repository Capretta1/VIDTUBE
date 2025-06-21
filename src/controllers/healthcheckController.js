import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  /**
   * Handles the health check request.
   * Responds with a 200 status code and a success message.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  res
    .status(200) // Set the response status to 200
    .json(new apiResponse(200, "OK", "Service is healthy")); // Send a JSON response with status 200 and a success message
});

export { healthcheck }; // Export the healthcheck function for use in routes or other modules
