import leaderboardService from '../services/leaderboard.service';
import leaderboardServiceHome from '../services/leaderboardHome.service';
import leaderboardServiceAway from '../services/leaderboardAway.service';

export class LeaderboardController {
  private _leaderboardService = leaderboardService;

  private _leaderboardHomeService = leaderboardServiceHome;

  private _leaderboardAwayService = leaderboardServiceAway;

  public async get() {
    return this._leaderboardService.get();
  }

  public async getHome() {
    return this._leaderboardHomeService.get();
  }

  public async getAway() {
    return this._leaderboardAwayService.get();
  }
}

export default new LeaderboardController();
