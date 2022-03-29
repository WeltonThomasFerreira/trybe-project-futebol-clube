import HttpError from '../../errors/HttpError';

export const MATCHS_NOT_FOUND = new HttpError(404, 'Matchs not found');

export default { MATCHS_NOT_FOUND };
