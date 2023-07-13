import { IUserModel } from '../Interfaces/Users/IUserModel';
import { NewEntity } from '../Interfaces';
import SequelizeUser from '../database/models/SequelizeUser';
import { IUser } from '../Interfaces/Users/IUser';

export default class UserModel implements IUserModel {
  private model = SequelizeUser;

  async create(data: NewEntity<IUser>): Promise<IUser> {
    const user = await this.model.create(data);
    const { id, username, role, email, password }: IUser = user;
    return { id, username, role, email, password };
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.model.findAll();
    return users.map(({ id, username, role, email, password }: IUser) => ({
      id,
      username,
      role,
      email,
      password,
    }));
  }

  async findById(id: number): Promise<IUser | null> {
    const user = await this.model.findByPk(id);
    return user ? { id,
      username: user.username,
      role: user.role,
      email: user.email,
      password: user.password } : null;
  }

  async findByEmail(email: IUser['email']): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email } });
    return user || null;
  }

  async update(id: number, data: Partial<IUser>): Promise<IUser | null> {
    const user = await this.model.findByPk(id);
    if (!user) return null;
    await this.model.update(data, { where: { id } });
    return { id,
      username: user.username,
      role: user.role,
      email: user.email,
      password: user.password };
  }

  async delete(id: number): Promise<number> {
    await this.model.destroy({ where: { id } });
    return id;
  }
}
