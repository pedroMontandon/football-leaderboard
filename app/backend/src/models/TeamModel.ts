import { NewEntity } from '../Interfaces';
import { ITeam } from '../Interfaces/Teams/ITeam';
import { ITeamModel } from '../Interfaces/Teams/ITeamModel';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class TeamModel implements ITeamModel {
  private model = SequelizeTeam;

  async create(data: NewEntity<ITeam>): Promise<ITeam> {
    const team = await this.model.create(data);
    const { id, teamName }: ITeam = team;
    return { id, teamName };
  }

  async findAll(): Promise<ITeam[]> {
    const teams = await this.model.findAll();
    return teams.map(({ id, teamName }) => ({
      id,
      teamName,
    }));
  }
  
  async findById(id: number): Promise<ITeam | null> {
    const team = await this.model.findByPk(id);
    return team ? { id, teamName: team.teamName } : null;
  }

  async update(id: number, data: Partial<ITeam>): Promise<ITeam | null> {
    const team = await this.model.findByPk(id);
    if (!team) return null;
    await this.model.update(data, { where: { id } });
    return { id, teamName: team.teamName };
  }

  async delete(id: number): Promise<number> {
    await this.model.destroy({ where: { id } });
    return id;
  }
};