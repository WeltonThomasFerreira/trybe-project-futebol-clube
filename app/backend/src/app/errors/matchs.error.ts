import HttpError from '../../errors/HttpError';

export const MATCHS_NOT_FOUND = new HttpError(404, 'Matchs not found');

export const HOME_TEAM_DOES_NOT_EXISTS = new HttpError(
  404,
  'Home team does not exist',
);

export const AWAY_TEAM_DOES_NOT_EXISTS = new HttpError(
  404,
  'Away team does not exist',
);

export const INVALID_MATCH_DATA = new HttpError(
  401,
  'Invalid match data',
);
