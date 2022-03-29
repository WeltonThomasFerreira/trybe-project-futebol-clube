import clubsService from '../services/clubs.service';

export class ClubsController {
  private _clubsService = clubsService;

  public async get() {
    return this._clubsService.getAll();
  }
}

export default new ClubsController();
