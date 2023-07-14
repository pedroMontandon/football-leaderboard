import { IMatchModel } from '../Interfaces/Matches/IMatchModel';
import { IMatch } from '../Interfaces/Matches/IMatch';
import { NewEntity } from '../Interfaces';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;
  async create(data: NewEntity<IMatch>): Promise<IMatch> {
    const match = await this.model.create(data);
    const { id, homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress }: IMatch = match;
    return { id, homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress };
  }

  async findAll(): Promise<IMatch[]> {
    const matches = await this.model.findAll({
      include: [
        { model: SequelizeTeam, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: SequelizeTeam, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches.map(({ id, homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals,
      inProgress, homeTeam, awayTeam }: IMatch) =>
      ({
        id,
        homeTeamId,
        awayTeamId,
        homeTeamGoals,
        awayTeamGoals,
        inProgress,
        homeTeam,
        awayTeam,
      }));
  }

  async findByQuery(field: string, query: boolean): Promise<IMatch[]> {
    const filteredQueries = await this.model.findAll({
      where: { [field]: query },
      include: [
        { model: SequelizeTeam, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: SequelizeTeam, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return filteredQueries;
  }

  async findById(id: number): Promise<IMatch | null> {
    const match = await this.model.findByPk(id);
    return match ? { id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeTeamGoals: match.homeTeamGoals,
      awayTeamGoals: match.awayTeamGoals,
      inProgress: match.inProgress } : null;
  }

  async update(id: number, data: Partial<IMatch>): Promise<IMatch | null> {
    const match = await this.model.findByPk(id);
    if (!match) return null;
    await this.model.update(data, { where: { id } });
    return { id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeTeamGoals: match.homeTeamGoals,
      awayTeamGoals: match.awayTeamGoals,
      inProgress: match.inProgress };
  }

  async delete(id: number): Promise<number> {
    await this.model.destroy({ where: { id } });
    return id;
  }
}
