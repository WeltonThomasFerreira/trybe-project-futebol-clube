import { Router } from 'express';
import matchsController from '../../app/controllers/matchs.controller';

const matchsRoute = Router();

matchsRoute.get('/', async (req, res, next) => {
  try {
    const response = await matchsController.get();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default matchsRoute;
