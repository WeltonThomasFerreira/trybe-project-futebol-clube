import { app } from '../app';
import loginRoute from '../api/routes/login.route';
import loginController from '../app/controllers/login.controller';
import loginValidation from '../app/validations/login.validation';
import loginService from '../app/services/login.service';
import User from '../database/models/User.model';

export {
  app,
  loginRoute,
  loginController,
  loginValidation,
  loginService,
  User,
};
