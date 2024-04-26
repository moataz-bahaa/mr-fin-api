import { StatusCodes } from 'http-status-codes';

class CustomError extends Error {
  constructor(message) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  constructor(message) {
    super(message ?? 'not found');
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class BadRequestError extends CustomError {
  constructor(message) {
    super(message ?? 'bad request error');
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class UnAuthenticatedError extends CustomError {
  constructor(message) {
    super(message ?? 'un authenticated error');
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.error = MESSAGES.UNAUTHENTICATED;
  }
}

export class ForbidenError extends CustomError {
  constructor(message) {
    super(message ?? `you do not have access`);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
