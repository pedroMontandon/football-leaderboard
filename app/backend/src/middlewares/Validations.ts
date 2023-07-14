import { NextFunction, Request, Response } from 'express';
import JwtUtils from '../utils/JwtUtils';
import TeamService from '../services/TeamService';

export default class Validations {
  private static passwordLength = 6;
  private static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private static teamService = new TeamService();
  static validateLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    if (password.length < Validations.passwordLength || !Validations.emailRegex.test(email)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return next();
  }

  static validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ message: 'Token not found' });
      }
      const jwtUtils = new JwtUtils();
      jwtUtils.verify(authorization);
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  }

  static async validateMatch(req: Request, res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId } = req.body;
    if (homeTeamId === awayTeamId) {
      return res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    const foundHomeTeam = (await Validations.teamService.getTeamById(homeTeamId));
    const foundAwayTeam = await Validations.teamService.getTeamById(awayTeamId);
    if (foundHomeTeam.status !== 'SUCCESSFUL' || foundAwayTeam.status !== 'SUCCESSFUL') {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }
    return next();
  }
}
