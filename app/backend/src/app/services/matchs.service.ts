import Club from '../../database/models/Club.model';
import Match from '../../database/models/Match.model';
import { MATCHS_NOT_FOUND } from '../errors/matchs.error';

class MatchsService {
  private _match = Match;

  public async getAll() {
    const matchs = await this._match.findAll({
      include: [
        {
          model: Club,
          attributes: ['clubName'],
          as: 'homeClub',
        },
        {
          model: Club,
          attributes: ['clubName'],
          as: 'awayClub',
        },
      ],
    });
    if (matchs.length === 0) throw MATCHS_NOT_FOUND;
    return matchs;
  }

  public async getInProgress(query: string) {
    const inProgress = query === 'true';
    const matchs = await this._match.findAll({
      where: { inProgress },
      include: [
        {
          model: Club,
          attributes: ['clubName'],
          as: 'homeClub',
        },
        {
          model: Club,
          attributes: ['clubName'],
          as: 'awayClub',
        },
      ],
    });
    if (matchs.length === 0) throw MATCHS_NOT_FOUND;
    return matchs;
  }
}

export default new MatchsService();
