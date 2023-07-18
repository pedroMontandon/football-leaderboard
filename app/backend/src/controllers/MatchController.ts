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
    const { status, data } = await this.matchService.getMatchesByProgress(inProgress === 'true');
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async finishMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status, data } = await this.matchService.finishMatch(+id);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async score(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const goals = req.body;
    const { status, data } = await this.matchService.updateMatch(+id, goals);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async startMatch(req: Request, res: Response): Promise<Response> {
    const match = req.body;
    const { status, data } = await this.matchService.startMatch(match);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
