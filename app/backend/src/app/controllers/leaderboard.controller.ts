import leaderboardService from '../services/leaderboard.service';

export class LeaderboardController {
  private _leaderboardService = leaderboardService;

  public async get() {
    return this._leaderboardService.get();
  }
}

export default new LeaderboardController();
