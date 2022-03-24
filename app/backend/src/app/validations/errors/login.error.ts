import HttpError from './HttpError';

export const emailIsRequired = new HttpError(400, 'Email is required');

export const passwordIsRequired = new HttpError(400, 'Password is required');

export const loginIsInvalid = new HttpError(
  401,
  'Username or password invalid',
);
