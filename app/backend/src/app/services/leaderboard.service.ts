/* eslint-disable class-methods-use-this */
import Match from '../../database/models/Match.model';
import Club from '../../database/models/Club.model';
import { ClubPlusMatch } from '../domain';
// import { } from '../errors/leaderboard.error';

export class LeaderboardService {
  private _club = Club;

  private _map: unknown;

  private calculateTotalPoints(club: ClubPlusMatch) {
    const homePoints = club.homeClub.map((match) => {
      let totalPoints = 0;
      if (match.homeTeamGoals > match.awayTeamGoals) totalPoints = 3;
      if (match.homeTeamGoals === match.awayTeamGoals) totalPoints = 1;
      return totalPoints;
    });
    const awayPoints = club.awayClub.map((match) => {
      let totalPoints = 0;
      if (match.awayTeamGoals > match.homeTeamGoals) totalPoints = 3;
      if (match.homeTeamGoals === match.awayTeamGoals) totalPoints = 1;
      return totalPoints;
    });
    return (
      homePoints.reduce((acc, cur) => acc + cur)
      + awayPoints.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalGames(club: ClubPlusMatch) {
    return club.homeClub.length + club.awayClub.length;
  }

  private calculateTotalVictories(club: ClubPlusMatch) {
    const homeVictories = club.homeClub.map((match) => {
      let totalVictories = 0;
      if (match.homeTeamGoals > match.awayTeamGoals) totalVictories = 1;
      return totalVictories;
    });
    const awayVictories = club.awayClub.map((match) => {
      let totalVictories = 0;
      if (match.awayTeamGoals > match.homeTeamGoals) totalVictories = 1;
      return totalVictories;
    });
    return (
      homeVictories.reduce((acc, cur) => acc + cur)
      + awayVictories.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalDraws(club: ClubPlusMatch) {
    const homeDraws = club.homeClub.map((match) => {
      let totalDraws = 0;
      if (match.homeTeamGoals === match.awayTeamGoals) totalDraws = 1;
      return totalDraws;
    });
    const awayDraws = club.awayClub.map((match) => {
      let totalDraws = 0;
      if (match.awayTeamGoals === match.homeTeamGoals) totalDraws = 1;
      return totalDraws;
    });
    return (
      homeDraws.reduce((acc, cur) => acc + cur)
      + awayDraws.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateTotalLoses(club: ClubPlusMatch) {
    const homeLoses = club.homeClub.map((match) => {
      let totalLoses = 0;
      if (match.homeTeamGoals < match.awayTeamGoals) totalLoses = 1;
      return totalLoses;
    });
    const awayLoses = club.awayClub.map((match) => {
      let totalLoses = 0;
      if (match.awayTeamGoals < match.homeTeamGoals) totalLoses = 1;
      return totalLoses;
    });
    return (
      homeLoses.reduce((acc, cur) => acc + cur)
      + awayLoses.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateGoalsFavor(club: ClubPlusMatch) {
    const homeGoalsFavor = club.homeClub.map((match) => match.homeTeamGoals);
    const awayGoalsFavor = club.awayClub.map((match) => match.awayTeamGoals);
    return (
      homeGoalsFavor.reduce((acc, cur) => acc + cur)
      + awayGoalsFavor.reduce((acc, cur) => acc + cur)
    );
  }

  private calculateGoalsOwn(club: ClubPlusMatch) {
    const homeGoalsOwn = club.homeClub.map((match) => match.awayTeamGoals);
    const awayGoalsOwn = club.awayClub.map((match) => match.homeTeamGoals);
    return (
      homeGoalsOwn.reduce((acc, cur) => acc + cur)
      + awayGoalsOwn.reduce((acc, cur) => acc + cur)
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
        totalLoses: this.calculateTotalLoses(club as unknown as ClubPlusMatch),
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
    return this._map;
  }
}

export default new LeaderboardService();
