import * as Joi from 'joi';
import { UserCredentials } from '../domain';
import {
  FIELDS_MUST_BE_FILLED,
  INCORRECT_EMAIL_OR_PASSWORD,
} from '../errors/login.error';

export class LoginValidation {
  private _isRequired = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).error(FIELDS_MUST_BE_FILLED);

  private _isValid = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }).error(INCORRECT_EMAIL_OR_PASSWORD);

  public async validate(body: UserCredentials) {
    await this._isRequired.validateAsync(body);
    return this._isValid.validateAsync(body);
  }
}

export default new LoginValidation();
