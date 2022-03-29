import clubsService from '../services/clubs.service';

export class ClubsController {
  private _clubsService = clubsService;

  public async get(id?: string) {
    if (typeof id === 'string') return this._clubsService.getById(id);
    return this._clubsService.getAll();
  }
}

export default new ClubsController();
