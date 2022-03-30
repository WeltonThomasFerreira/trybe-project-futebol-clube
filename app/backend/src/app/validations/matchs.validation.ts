import Joi = require('joi');
import Club from '../../database/models/Club.model';
import { GoalsStatus, NewMatch, Teams } from '../domain';
import Match from '../../database/models/Match.model';
import {
  THERE_IS_NO_TEAM,
  INVALID_MATCH_DATA,
  EQUAL_TEAMS,
  THERE_IS_NO_MATCH,
} from '../errors/matchs.error';

export class MatchsValidation {
  private _matchIsValid = Joi.object({
    homeTeam: Joi.number().required(),
    awayTeam: Joi.number().required(),
    homeTeamGoals: Joi.number().required(),
    awayTeamGoals: Joi.number().required(),
    inProgress: Joi.boolean().required(),
  }).error(INVALID_MATCH_DATA);

  private _bodyIsValid = Joi.object({
    homeTeamGoals: Joi.number().required(),
    awayTeamGoals: Joi.number().required(),
  }).error(new Error('TODO'));

  private _match = Match;

  private _club = Club;

  private async validateTeams(teams: Teams) {
    const { homeTeam, awayTeam } = teams;
    if (homeTeam === awayTeam) throw EQUAL_TEAMS;
    const home = await this._club.findByPk(homeTeam);
    const away = await this._club.findByPk(awayTeam);
    if (home === null || away === null) throw THERE_IS_NO_TEAM;
  }

  public async validateId(id: string) {
    const validId = parseInt(id, 10);
    const match = await this._match.findByPk(validId);
    if (match === null) throw THERE_IS_NO_MATCH;
    return validId;
  }

  public async validateBody(body: GoalsStatus) {
    return this._bodyIsValid.validateAsync(body);
  }

  public async validate(newMatch: NewMatch) {
    await this.validateTeams({
      homeTeam: newMatch.homeTeam,
      awayTeam: newMatch.awayTeam,
    });
    return this._matchIsValid.validateAsync(newMatch);
  }
}

export default new MatchsValidation();
