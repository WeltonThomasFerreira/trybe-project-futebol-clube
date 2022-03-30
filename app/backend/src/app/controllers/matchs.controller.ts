import matchsService from '../services/matchs.service';

export class MatchsController {
  private _matchsService = matchsService;

  public async get(inProgress: string | undefined) {
    if (inProgress === 'true' || inProgress === 'false') {
      return this._matchsService.getInProgress(inProgress);
    }
    return this._matchsService.getAll();
  }
}

export default new MatchsController();
