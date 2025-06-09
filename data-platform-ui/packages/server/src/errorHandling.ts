import express from 'express';
import createHttpError from 'http-errors';

function convertCause(cause: unknown): createHttpError.HttpError {
  if (createHttpError.isHttpError(cause)) {
    return cause;
  }

  if (!(cause instanceof Error)) {
    return new createHttpError.InternalServerError();
  }

  return new createHttpError.InternalServerError(`${cause.name}: ${cause.message}`);
}

export default function errorHandler(
  cause: unknown,
  req: express.Request,
  res: express.Response,
  _: express.NextFunction
): void {
  const error: createHttpError.HttpError = convertCause(cause);

  res.status(error.status).jsonp(error);
  return;
}
