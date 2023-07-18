import MatchModel from '../models/MatchModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatch, matchGoals, startingMatch } from '../Interfaces/Matches/IMatch';

export default class MatchService {
  constructor(private matchModel = new MatchModel()) {}

  async getAllMatches(): Promise<ServiceResponse<IMatch[]>> {
    const data = await this.matchModel.findAll();
    return { status: 'SUCCESSFUL', data };
  }

  async getMatchesByProgress(query: boolean): Promise<ServiceResponse<IMatch[]>> {
    const data = await this.matchModel.findByQuery('inProgress', query);
    return { status: 'SUCCESSFUL', data };
  }

  async getTeamById(id: number): Promise<ServiceResponse<IMatch> | null> {
    const data = await this.matchModel.findById(id);
    if (!data) return null;
    return { status: 'SUCCESSFUL', data };
  }

  async finishMatch(id: number): Promise<ServiceResponse<{ message: 'Finished' }>> {
    await this.matchModel.update(id, { inProgress: false });
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  async updateMatch(id: number, newData: matchGoals): Promise<ServiceResponse<IMatch>> {
    if (!await this.getTeamById(id)) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }
    const data = await this.matchModel.update(id, newData);
    if (!data) return { status: 'INVALID_DATA', data: { message: 'Invalid Data' } };
    return { status: 'SUCCESSFUL', data };
  }

  async startMatch(match: startingMatch) {
    const data = await this.matchModel.create({ ...match, inProgress: true });
    return { status: 'CREATED', data };
  }
}
