import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET!;
interface TokenPayload {
  sub: string;
  email: string;
  role: 'admin' | 'member';
}

export const hashPassword = (p: string) => bcrypt.hash(p, 10);

export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);

export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): TokenPayload {
  try {
    console.log(token);
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
