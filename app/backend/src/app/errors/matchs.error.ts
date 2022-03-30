import HttpError from '../../errors/HttpError';

export const MATCHS_NOT_FOUND = new HttpError(404, 'Matchs not found');

export const THERE_IS_NO_TEAM = new HttpError(
  401,
  'There is no team with such id!',
);

export const THERE_IS_NO_MATCH = new HttpError(
  401,
  'There is no match with such id!',
);

export const INVALID_MATCH_DATA = new HttpError(401, 'Invalid match data');

export const EQUAL_TEAMS = new HttpError(
  401,
  'It is not possible to create a match with two equal teams',
);
