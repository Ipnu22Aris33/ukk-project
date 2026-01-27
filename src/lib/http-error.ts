// utils/httpErrors.ts
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

// 400
export class BadRequest extends HttpError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

// 401
export class Unauthorized extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

// 403
export class Forbidden extends HttpError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

// 404
export class NotFound extends HttpError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

// 409
export class Conflict extends HttpError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

// 422 (opsional, sering buat validasi)
export class UnprocessableEntity extends HttpError {
  constructor(message = "Unprocessable Entity") {
    super(422, message);
  }
}

// 500 
export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}
