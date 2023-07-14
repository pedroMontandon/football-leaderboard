import { NextFunction, Request, Response } from 'express';
import JwtUtils from '../utils/JwtUtils';

export default class Validations {
  private static passwordLength = 6;
  private static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
}
