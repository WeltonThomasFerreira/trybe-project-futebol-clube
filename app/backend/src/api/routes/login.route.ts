import { Router } from 'express';
import loginController from '../../app/controllers/login.controller';

const loginRoute = Router();

loginRoute.post('/', async (req, res, next) => {
  try {
    const response = await loginController.post(req.body);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default loginRoute;
