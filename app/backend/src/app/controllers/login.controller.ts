import { IncomingHttpHeaders } from 'node:http2';
import loginValidation from '../validations/login.validation';
import loginService from '../services/login.service';
import { UserCredentials, UserLogged } from '../domain';

export class LoginController {
  private _loginValidation = loginValidation;

  private _loginService = loginService;

  public async post(body: UserCredentials): Promise<UserLogged> {
    const userCredentials = await this._loginValidation.validate(body);
    return this._loginService.login(userCredentials);
  }

  public async get(headers: IncomingHttpHeaders) {
    return this._loginService.authorize(headers.authorization);
  }
}

export default new LoginController();
