import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'ts-custom-error';

class HttpError extends CustomError {
  public constructor(public code: number, message?: string) {
    super(message);
  }
}

const errorHandler = async (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) =>
  res
    .status(err.code || 500)
    .json({ error: err.message || 'Internal Server Error' });

export default errorHandler;
