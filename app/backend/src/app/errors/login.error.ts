import HttpError from '../../errors/HttpError';

export const FIELDS_MUST_BE_FILLED = new HttpError(
  401,
  'All fields must be filled',
);

export const INCORRECT_EMAIL_OR_PASSWORD = new HttpError(
  401,
  'Incorrect email or password',
);
