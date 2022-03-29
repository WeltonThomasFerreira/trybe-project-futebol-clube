import { DataTypes, Model } from 'sequelize';
import db from '.';
import Match from './Match.model';

class Club extends Model {
  public id!: number;

  public clubName!: string;
}

Club.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    clubName: DataTypes.STRING,
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'clubs',
    timestamps: false,
  },
);

Match.belongsTo(Club, { foreignKey: 'homeTeam', as: 'homeClub' });
Match.belongsTo(Club, { foreignKey: 'awayTeam', as: 'awayClub' });

Club.hasMany(Match, { foreignKey: 'homeTeam', as: 'homeClub' });
Club.hasMany(Match, { foreignKey: 'awayTeam', as: 'awayClub' });

export default Club;
