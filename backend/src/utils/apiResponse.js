/**
 * Standardised API response helpers.
 * Every response from this server has the shape:
 *   { success: boolean, message: string, data?: any }
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {any} data       - Payload to send (null if none)
 * @param {string} message - Human-readable success message
 * @param {number} statusCode - HTTP status (default 200)
 */
export const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable error message
 * @param {number} statusCode - HTTP status (default 500)
 * @param {any} errors     - Optional field-level validation errors
 */
export const sendError = (res, message = "Something went wrong", statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};
