import * as Joi from 'joi';
import {
  emailIsRequired,
  passwordIsRequired,
  loginIsInvalid,
} from './errors/login.error';

interface ILogin {
  email: string;
  password: string;
}

class Login {
  private _isRequired = Joi.object({
    email: Joi.string().required().error(emailIsRequired),
    password: Joi.string().required().error(passwordIsRequired),
  });

  private _isValid = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }).error(loginIsInvalid);

  async validate(body: ILogin) {
    await this._isRequired.validateAsync(body);
    return this._isValid.validateAsync(body);
  }
}

export default new Login();
