// /* eslint-disable class-methods-use-this */
import Match from '../../database/models/Match.model';
import Club from '../../database/models/Club.model';
import { ClubPlusMatch, Leaderboard } from '../domain';
// import { } from '../errors/leaderboard.error';

export class LeaderboardAwayService {
  private _club = Club;

  private _map: Leaderboard[];

  private _isTheFunctionOk: boolean;

  private calculateTotalPoints(club: ClubPlusMatch) {
    const awayPoints = club.awayClub.map((match) => {
      let totalPoints = 0;
      if (match.awayTeamGoals > match.homeTeamGoals) totalPoints = 3;
      if (match.homeTeamGoals === match.awayTeamGoals) totalPoints = 1;
      return totalPoints;
    });
    this._isTheFunctionOk = true;
    return (
      awayPoints.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalGames(club: ClubPlusMatch) {
    this._isTheFunctionOk = true;
    return club.awayClub.length;
  }

  private calculateTotalVictories(club: ClubPlusMatch) {
    const awayVictories = club.awayClub.map((match) => {
      let totalVictories = 0;
      if (match.awayTeamGoals > match.homeTeamGoals) totalVictories = 1;
      return totalVictories;
    });
    this._isTheFunctionOk = true;
    return (
      awayVictories.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalDraws(club: ClubPlusMatch) {
    const awayDraws = club.awayClub.map((match) => {
      let totalDraws = 0;
      if (match.awayTeamGoals === match.homeTeamGoals) totalDraws = 1;
      return totalDraws;
    });
    this._isTheFunctionOk = true;
    return (
      awayDraws.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalLoses(club: ClubPlusMatch) {
    const awayLoses = club.awayClub.map((match) => {
      let totalLoses = 0;
      if (match.awayTeamGoals < match.homeTeamGoals) totalLoses = 1;
      return totalLoses;
    });
    this._isTheFunctionOk = true;
    return (
      awayLoses.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateGoalsFavor(club: ClubPlusMatch) {
    const awayGoalsFavor = club.awayClub.map((match) => match.awayTeamGoals);
    this._isTheFunctionOk = true;
    return (
      awayGoalsFavor.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateGoalsOwn(club: ClubPlusMatch) {
    const awayGoalsOwn = club.awayClub.map((match) => match.homeTeamGoals);
    this._isTheFunctionOk = true;
    return (
      awayGoalsOwn.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateGoalsBalance(club: ClubPlusMatch) {
    return this.calculateGoalsFavor(club) - this.calculateGoalsOwn(club);
  }

  private calculateEfficiency(club: ClubPlusMatch) {
    const totalPoints = this.calculateTotalPoints(
      club as unknown as ClubPlusMatch,
    );
    const totalGames = this.calculateTotalGames(
      club as unknown as ClubPlusMatch,
    );
    return Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));
  }

  private sortLeaderboard(leaderboard: Leaderboard[]) {
    this._isTheFunctionOk = true;
    return leaderboard.sort((club1, club2) => {
      if (club1.totalPoints > club2.totalPoints) return -1;
      if (club1.totalPoints < club2.totalPoints) return 1;

      if (club1.goalsBalance > club2.goalsBalance) return -1;
      if (club1.goalsBalance < club2.goalsBalance) return 1;

      if (club1.goalsFavor > club2.goalsFavor) return -1;
      if (club1.goalsFavor < club2.goalsFavor) return 1;

      if (club1.goalsOwn > club2.goalsOwn) return -1;
      if (club1.goalsOwn < club2.goalsOwn) return 1;

      return 0;
    });
  }

  private async mapLeaderboard(clubs: Club[]) {
    this._map = clubs.map((club) => {
      const result = {
        name: club.clubName,
        totalPoints: this.calculateTotalPoints(
          club as unknown as ClubPlusMatch,
        ),
        totalGames: this.calculateTotalGames(club as unknown as ClubPlusMatch),
        totalVictories: this.calculateTotalVictories(club as unknown as ClubPlusMatch),
        totalDraws: this.calculateTotalDraws(club as unknown as ClubPlusMatch),
        totalLosses: this.calculateTotalLoses(club as unknown as ClubPlusMatch),
        goalsFavor: this.calculateGoalsFavor(club as unknown as ClubPlusMatch),
        goalsOwn: this.calculateGoalsOwn(club as unknown as ClubPlusMatch),
        goalsBalance: this.calculateGoalsBalance(club as unknown as ClubPlusMatch),
        efficiency: this.calculateEfficiency(club as unknown as ClubPlusMatch),
      };
      return result;
    });
  }

  public async get() {
    const clubs = await this._club.findAll({
      include: [
        {
          where: { inProgress: false },
          model: Match,
          as: 'homeClub',
        },
        {
          where: { inProgress: false },
          model: Match,
          as: 'awayClub',
        },
      ],
    });
    this.mapLeaderboard(clubs);
    this._map = this.sortLeaderboard(this._map);
    return this._map;
  }
}

export default new LeaderboardAwayService();
