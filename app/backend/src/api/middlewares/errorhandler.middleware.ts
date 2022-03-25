import { Request, Response, NextFunction } from 'express';
import HttpError from '../../errors/HttpError';

const errorHandler = async (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) =>
  res
    .status(err.code || 500)
    .json({ message: err.message || 'Internal Server Error' });

export default errorHandler;
