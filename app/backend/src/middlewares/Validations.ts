import { NextFunction, Request, Response } from 'express';
import JwtUtils from '../utils/JwtUtils';

export default class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    return next();
  }

  static validateToken(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const jwtUtils = new JwtUtils();
    try {
      jwtUtils.verify(authorization);
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
    return next();
  }
}
