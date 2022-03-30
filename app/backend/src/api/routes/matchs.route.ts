import { Router } from 'express';
import matchsController from '../../app/controllers/matchs.controller';

const matchsRoute = Router();

matchsRoute.get('/', async (req, res, next) => {
  try {
    const inProgress = req.query.inProgress as string;
    const response = await matchsController.get(inProgress);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

matchsRoute.post('/', async (req, res, next) => {
  try {
    const { headers, body } = req;
    const response = await matchsController.post(headers, body);
    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

matchsRoute.patch('/:id/finish', async (req, res, next) => {
  try {
    const response = await matchsController.patch(req.headers, req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default matchsRoute;
