import MatchModel from '../models/MatchModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatch } from '../Interfaces/Matches/IMatch';
import calculateHomePoints from '../utils/LeaderboardUtils';
import { IPartialResults } from '../Interfaces/Leaderboard/IPartialResults';

export default class LeaderboardService {
  constructor(private matchModel = new MatchModel()) {}

  async getFinishedGames(): Promise <IMatch[]> {
    const data = await this.matchModel.findByQuery('inProgress', false);
    return data;
  }

  async homeLeaderboard(): Promise<ServiceResponse<IPartialResults[]>> {
    const finishedGames = await this.getFinishedGames();
    const data = calculateHomePoints(finishedGames);
    return { status: 'SUCCESSFUL', data };
  }
}
