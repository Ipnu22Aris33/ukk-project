import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET!;

export const hashPassword = (p: string) => bcrypt.hash(p, 10);

export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);

export function createToken(payload: { id: string; email:string; role: 'admin' | 'member' }) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as {
      id: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}
