// /* eslint-disable class-methods-use-this */
import Match from '../../database/models/Match.model';
import Club from '../../database/models/Club.model';
import { ClubPlusMatch, Leaderboard } from '../domain';
// import { } from '../errors/leaderboard.error';

export class LeaderboardHomeService {
  private _club = Club;

  private _map: Leaderboard[];

  private _isTheFunctionOk: boolean;

  private calculateTotalPoints(club: ClubPlusMatch) {
    const homePoints = club.homeClub.map((match) => {
      let totalPoints = 0;
      if (match.homeTeamGoals > match.awayTeamGoals) totalPoints = 3;
      if (match.homeTeamGoals === match.awayTeamGoals) totalPoints = 1;
      return totalPoints;
    });
    this._isTheFunctionOk = true;
    return (
      homePoints.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalGames(club: ClubPlusMatch) {
    this._isTheFunctionOk = true;
    return club.homeClub.length;
  }

  private calculateTotalVictories(club: ClubPlusMatch) {
    const homeVictories = club.homeClub.map((match) => {
      let totalVictories = 0;
      if (match.homeTeamGoals > match.awayTeamGoals) totalVictories = 1;
      return totalVictories;
    });
    this._isTheFunctionOk = true;
    return (
      homeVictories.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalDraws(club: ClubPlusMatch) {
    const homeDraws = club.homeClub.map((match) => {
      let totalDraws = 0;
      if (match.homeTeamGoals === match.awayTeamGoals) totalDraws = 1;
      return totalDraws;
    });
    this._isTheFunctionOk = true;
    return (
      homeDraws.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalLoses(club: ClubPlusMatch) {
    const homeLoses = club.homeClub.map((match) => {
      let totalLoses = 0;
      if (match.homeTeamGoals < match.awayTeamGoals) totalLoses = 1;
      return totalLoses;
    });
    this._isTheFunctionOk = true;
    return (
      homeLoses.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateGoalsFavor(club: ClubPlusMatch) {
    const homeGoalsFavor = club.homeClub.map((match) => match.homeTeamGoals);
    this._isTheFunctionOk = true;
    return (
      homeGoalsFavor.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateGoalsOwn(club: ClubPlusMatch) {
    const homeGoalsOwn = club.homeClub.map((match) => match.awayTeamGoals);
    this._isTheFunctionOk = true;
    return (
      homeGoalsOwn.reduce((acc, cur) => acc + cur)
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

export default new LeaderboardHomeService();
