import * as Joi from 'joi';
import { UserCredentials } from '../domain';
import {
  emailIsRequired,
  passwordIsRequired,
  loginIsInvalid,
} from './errors/login.error';

class LoginValidation {
  private _isRequired = Joi.object({
    email: Joi.string().required().error(emailIsRequired),
    password: Joi.string().required().error(passwordIsRequired),
  });

  private _isValid = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }).error(loginIsInvalid);

  public async validate(body: UserCredentials) {
    await this._isRequired.validateAsync(body);
    return this._isValid.validateAsync(body);
  }
}

export default new LoginValidation();
