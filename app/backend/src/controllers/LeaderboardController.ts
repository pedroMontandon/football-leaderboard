import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  async homeLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.leaderboardService.leaderboard('home');
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async awayLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.leaderboardService.leaderboard('away');
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async wholeLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.leaderboardService.leaderboard('general');
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
