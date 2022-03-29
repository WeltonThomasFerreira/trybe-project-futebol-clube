import Club from '../../database/models/Club.model';

class ClubsService {
  private _club = Club;

  public async getAll() {
    const clubs = await this._club.findAll();
    return clubs;
  }
}

export default new ClubsService();
