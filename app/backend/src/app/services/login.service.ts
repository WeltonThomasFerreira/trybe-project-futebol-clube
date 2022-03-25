import * as jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';
import * as bcrypt from 'bcrypt';
import { UserCredentials } from '../domain';

import User from '../../database/models/User.model';
import { INCORRECT_EMAIL_OR_PASSWORD } from '../errors/login.error';

class LoginService {
  private _secret: string;

  constructor() {
    this.getEvaluationKey();
  }

  private async getEvaluationKey() {
    this._secret = await fs.readFile('jwt.evaluation.key', {
      encoding: 'utf-8',
    });
  }

  private _mapUser(param: User) {
    const user = {
      id: param.id,
      username: param.username,
      role: param.role,
      email: param.email,
    };

    return {
      user,
      token: jwt.sign(user, this._secret),
    };
  }

  public async login(login: UserCredentials) {
    const user = await User.findOne({
      where: { email: login.email },
    });
    if (user === null) throw INCORRECT_EMAIL_OR_PASSWORD;
    const passwordIsValid = await bcrypt.compare(login.password, user.password);
    if (passwordIsValid) return this._mapUser(user);
    throw INCORRECT_EMAIL_OR_PASSWORD;
  }
}

export default new LoginService();
