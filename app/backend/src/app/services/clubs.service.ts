import Club from '../../database/models/Club.model';
import { CLUBS_NOT_FOUND, CLUB_NOT_FOUND } from '../errors/clubs.error';

class ClubsService {
  private _club = Club;

  public async getAll() {
    const clubs = await this._club.findAll();
    if (clubs.length === 0) throw CLUBS_NOT_FOUND;
    return clubs;
  }

  public async getById(id: string) {
    const club = await this._club.findByPk(id);
    if (club === null) throw CLUB_NOT_FOUND;
    return club;
  }
}

export default new ClubsService();
