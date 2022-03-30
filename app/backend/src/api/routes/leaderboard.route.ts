import { Router } from 'express';
import leaderboardController from '../../app/controllers/leaderboard.controller';

const leaderboardRoute = Router();

leaderboardRoute.get('/home', async (req, res, next) => {
  try {
    const response = await leaderboardController.get();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default leaderboardRoute;
