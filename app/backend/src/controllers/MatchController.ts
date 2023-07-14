import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(private matchService = new MatchService()) {}

  async getAllMatches(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    if (!inProgress) {
      const { status, data } = await this.matchService.getAllMatches();
      return res.status(mapStatusHTTP(status)).json(data);
    }
    const { status, data } = await this.matchService.getOngoingMatches(inProgress === 'true');
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async getOngoingMatches(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    const { status, data } = await this.matchService.getOngoingMatches(inProgress === 'true');
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async finishMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status, data } = await this.matchService.finishMatch(+id);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
