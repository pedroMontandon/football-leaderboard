import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class UserController {
  constructor(private userService = new UserService()) {}
  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const { status, data } = await this.userService.findUser(email, password);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async getUserRole(req: Request, res: Response): Promise<Response> {
    const { authorization } = req.headers;
    const { status, data } = await this.userService.getUserRole(authorization as string);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
