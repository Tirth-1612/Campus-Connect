import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const HASH_ROUNDS = 10;

export async function hashPassword(plain) {
  if (typeof plain !== 'string' || plain.length < 6) {
    throw new Error('Invalid password');
  }
  return bcrypt.hash(plain, HASH_ROUNDS);
}

export async function comparePassword(plain, hash) {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'campus-connect-dev-secret';
}

export function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}
