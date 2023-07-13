import * as bcrypt from 'bcryptjs';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import UserModel from '../models/UserModel';
import { IUser } from '../Interfaces/Users/IUser';
import JwtUtils from '../utils/JwtUtils';
import { Token } from '../Interfaces';

export default class UserService {
  private jwtUtils = new JwtUtils();
  constructor(private userModel = new UserModel()) {}

  public async findUser(email: string, password: string): Promise<ServiceResponse<IUser | Token>> {
    const user = await this.userModel.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }
    const token = this.jwtUtils.sign({ id: user.id, email });
    return { status: 'SUCCESSFUL', data: { token } };
  }
}
