import MatchModel from '../models/MatchModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatch } from '../Interfaces/Matches/IMatch';

export default class MatchService {
  constructor(private matchModel = new MatchModel()) {}

  async getAllMatches(): Promise<ServiceResponse<IMatch[]>> {
    const data = await this.matchModel.findAll();
    return { status: 'SUCCESSFUL', data };
  }

  async getOngoingMatches(query: boolean): Promise<ServiceResponse<IMatch[]>> {
    const data = await this.matchModel.findByQuery('inProgress', query);
    return { status: 'SUCCESSFUL', data };
  }

  async finishMatch(id: number): Promise<ServiceResponse<{ message: 'Finished' }>> {
    const data = await this.matchModel.update(id, { inProgress: false });
    if (!data) return { status: 'NOT_FOUND', data: { message: 'Match not found' } };
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }
}
