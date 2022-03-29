import matchsService from '../services/matchs.service';

export class MatchsController {
  private _matchsService = matchsService;

  public async get() {
    return this._matchsService.getAll();
  }
}

export default new MatchsController();
