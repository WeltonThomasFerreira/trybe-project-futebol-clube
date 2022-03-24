import * as Jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';
import { UserCredentials } from '../domain';

class LoginService {
  private _jwt = Jwt;

  private _secret: string;

  constructor() {
    this.getEvaluationKey();
  }

  private async getEvaluationKey() {
    this._secret = await fs.readFile('jwt.evaluation.key', {
      encoding: 'utf-8',
    });
  }

  public login(login: UserCredentials) {
    return this._jwt.sign(login, this._secret);
  }
}

export default new LoginService();