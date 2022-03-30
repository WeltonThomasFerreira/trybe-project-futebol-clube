import Joi = require('joi');
import { NewMatch, Teams } from '../domain';
import Match from '../../database/models/Match.model';
import {
  HOME_TEAM_DOES_NOT_EXISTS,
  AWAY_TEAM_DOES_NOT_EXISTS,
  INVALID_MATCH_DATA,
} from '../errors/matchs.error';

export class MatchsValidation {
  private _isValid = Joi.object({
    homeTeam: Joi.number().required(),
    awayTeam: Joi.number().required(),
    homeTeamGoals: Joi.number().required(),
    awayTeamGoals: Joi.number().required(),
    inProgress: Joi.boolean().invalid(false).required(),
  }).error(INVALID_MATCH_DATA);

  private _match = Match;

  private async validateTeams(teams: Teams) {
    const { homeTeam, awayTeam } = teams;
    const home = await this._match.findByPk(homeTeam);
    const away = await this._match.findByPk(awayTeam);
    if (home === null) throw HOME_TEAM_DOES_NOT_EXISTS;
    if (away === null) throw AWAY_TEAM_DOES_NOT_EXISTS;
  }

  public async validate(newMatch: NewMatch) {
    const isValid = await this._isValid.validateAsync(newMatch);
    await this.validateTeams({
      homeTeam: newMatch.homeTeam,
      awayTeam: newMatch.awayTeam,
    });
    return isValid;
  }
}

export default new MatchsValidation();
