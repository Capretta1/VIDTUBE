class apiResponse {
  /**
   * Creates an instance of apiResponse.
   * @param {number} statusCode - The HTTP status code.
   * @param {Object} data - The data to be returned in the response.
   * @param {string} [message="Success"] - A message describing the response.
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; // HTTP status code for the response
    this.data = data; // Data to be included in the response
    this.message = message; // Message to describe the response, defaulting to "Success"
    this.success = statusCode >= 200 && statusCode < 400; // Determine if the response is successful based on the status code
  }
}

export { apiResponse }; //
