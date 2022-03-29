import { Router } from 'express';
import clubsController from '../../app/controllers/clubs.controller';

const clubsRoute = Router();

clubsRoute.get('/', async (req, res, next) => {
  try {
    const response = await clubsController.get();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default clubsRoute;
