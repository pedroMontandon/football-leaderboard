import * as jwt from 'jsonwebtoken';
import { Identifiable } from '../Interfaces';

export default class JwtUtils {
  private jwtSecret = process.env.JWT_SECRET || 'secret';

  sign(payload: { id: Identifiable['id'], email: string }): string {
    return jwt.sign(payload, this.jwtSecret);
  }
}
