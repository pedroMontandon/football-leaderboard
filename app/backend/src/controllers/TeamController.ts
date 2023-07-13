import { Request, Response } from 'express';
import TeamService from '../services/TeamService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class TeamController {
  constructor(private teamService = new TeamService()) {}
  public async getAllTeams(_req: Request, res: Response): Promise<Response> {
    const {status, data} = await this.teamService.getAllTeams();
    return res.status(mapStatusHTTP(status)).json(data);
  }
}