const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,

  reason: {
    200: 'OK',
    201: 'Created',
    204: 'No content',
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Access denied',
    404: 'Resource not found',
    422: 'Unprocessable entity',
    500: 'Internal server error',
  },
};

module.exports = HttpStatus;
