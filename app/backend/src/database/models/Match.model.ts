import { Model, DataTypes } from 'sequelize';
import db from '.';

class Match extends Model {
  public id!: number;

  public homeTeam!: number;

  public homeTeamGoals!: number;

  public awayTeam!: number;

  public awayTeamGoals!: number;

  public inProgress!: boolean;
}

Match.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    homeTeam: DataTypes.INTEGER,
    homeTeamGoals: DataTypes.INTEGER,
    awayTeam: DataTypes.INTEGER,
    awayTeamGoals: DataTypes.INTEGER,
    inProgress: DataTypes.BOOLEAN,
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'matchs',
    timestamps: false,
  },
);

export default Match;
