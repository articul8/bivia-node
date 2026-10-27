/**
 * Base class for all Bivia API errors.
 */
export class APIError extends Error {
  /** HTTP status code, if available. */
  readonly status: number | undefined;
  /** Parsed error body, if available. */
  readonly error: Record<string, unknown> | undefined;

  constructor(
    status: number | undefined,
    error: Record<string, unknown> | undefined,
    message: string,
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.error = error;
  }

  static async fromResponse(response: Response): Promise<APIError> {
    let body: Record<string, unknown> | undefined;
    let message = `${response.status} ${response.statusText}`;
    try {
      body = (await response.json()) as Record<string, unknown>;
      if (body?.detail) {
        message = `${response.status} ${String(body.detail)}`;
      } else if (body?.error) {
        message = `${response.status} ${String(body.error)}`;
      }
    } catch {
      // Response body was not JSON; use the status text.
    }

    const status = response.status;

    if (status === 400) return new BadRequestError(status, body, message);
    if (status === 401) return new AuthenticationError(status, body, message);
    if (status === 403) return new PermissionDeniedError(status, body, message);
    if (status === 404) return new NotFoundError(status, body, message);
    if (status === 422) return new UnprocessableEntityError(status, body, message);
    if (status === 429) return new RateLimitError(status, body, message);
    if (status >= 500) return new InternalServerError(status, body, message);

    return new APIError(status, body, message);
  }
}

/** 400 Bad Request */
export class BadRequestError extends APIError {
  override readonly status: 400 = 400;
  constructor(status: number, error: Record<string, unknown> | undefined, message: string) {
    super(status, error, message);
    this.name = 'BadRequestError';
  }
}

/** 401 Unauthorized */
export class AuthenticationError extends APIError {
  override readonly status: 401 = 401;
  constructor(status: number, error: Record<string, unknown> | undefined, message: string) {
    super(status, error, message);
    this.name = 'AuthenticationError';
  }
}

/** 403 Forbidden */
export class PermissionDeniedError extends APIError {
  override readonly status: 403 = 403;
  constructor(status: number, error: Record<string, unknown> | undefined, message: string) {
    super(status, error, message);
    this.name = 'PermissionDeniedError';
  }
}

/** 404 Not Found */
export class NotFoundError extends APIError {
  override readonly status: 404 = 404;
  constructor(status: number, error: Record<string, unknown> | undefined, message: string) {
    super(status, error, message);
    this.name = 'NotFoundError';
  }
}

/** 422 Unprocessable Entity */
export class UnprocessableEntityError extends APIError {
  override readonly status: 422 = 422;
  constructor(status: number, error: Record<string, unknown> | undefined, message: string) {
    super(status, error, message);
    this.name = 'UnprocessableEntityError';
  }
}

/** 429 Too Many Requests */
export class RateLimitError extends APIError {
  override readonly status: 429 = 429;
  constructor(status: number, error: Record<string, unknown> | undefined, message: string) {
    super(status, error, message);
    this.name = 'RateLimitError';
  }
}

/** 500+ Internal Server Error */
export class InternalServerError extends APIError {
  constructor(status: number, error: Record<string, unknown> | undefined, message: string) {
    super(status, error, message);
    this.name = 'InternalServerError';
  }
}

/** Network or connection error (no HTTP response received). */
export class APIConnectionError extends APIError {
  constructor(message: string, cause?: Error) {
    super(undefined, undefined, message);
    this.name = 'APIConnectionError';
    if (cause) this.cause = cause;
  }
}
