import Club from '../../database/models/Club.model';
import Match from '../../database/models/Match.model';
import { GoalsStatus, NewMatch } from '../domain';
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

  public async createMatch(match: NewMatch) {
    const newMatch = await this._match.create(match);
    const matchValues = Object.values(newMatch);
    newMatch.id = matchValues[matchValues.length - 1];
    return newMatch;
  }

  public async editMatch(id: number, body?: GoalsStatus) {
    if (body) {
      const { homeTeamGoals, awayTeamGoals } = body;
      await this._match.update(
        { homeTeamGoals, awayTeamGoals },
        { where: { id } },
      );
      return id;
    }
    await this._match.update({ inProgress: false }, { where: { id } });
    return id;
  }
}

export default new MatchsService();
