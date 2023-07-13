import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { ITeam } from '../Interfaces/Teams/ITeam';
import { ITeamModel } from '../Interfaces/Teams/ITeamModel';
import TeamModel from '../models/TeamModel';

export default class TeamService {
  constructor (private teamModel: ITeamModel = new TeamModel()) {}

  public async getAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data: teams };
  }
}