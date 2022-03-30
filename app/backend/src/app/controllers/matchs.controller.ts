import { IncomingHttpHeaders } from 'node:http2';
import { NewMatch } from '../domain';
import loginService from '../services/login.service';
import matchsService from '../services/matchs.service';
import matchsValidation from '../validations/matchs.validation';

export class MatchsController {
  private _matchsService = matchsService;

  private _loginService = loginService;

  private _matchsValidation = matchsValidation;

  public async get(inProgress: string | undefined) {
    if (inProgress === 'true' || inProgress === 'false') {
      return this._matchsService.getInProgress(inProgress);
    }
    return this._matchsService.getAll();
  }

  public async post(headers: IncomingHttpHeaders, newMatch: NewMatch) {
    await this._loginService.authorize(headers.authorization);
    const validMatch = await this._matchsValidation.validate(newMatch);
    return this._matchsService.createMatch(validMatch);
  }

  public async patch(headers: IncomingHttpHeaders, id: string) {
    // await this._loginService.authorize(headers.authorization);
    const validId = await this._matchsValidation.validateId(id);
    return this._matchsService.editMatch(validId);
  }
}

export default new MatchsController();
