import HttpError from '../../errors/HttpError';

export const CLUB_NOT_FOUND = new HttpError(404, 'Club not found');

export const CLUBS_NOT_FOUND = new HttpError(404, 'No club found');
