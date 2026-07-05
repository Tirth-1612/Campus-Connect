import { verifyToken } from './auth.js';

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || '';
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = parts[1];
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId || !decoded.role) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = { userId: decoded.userId, role: decoded.role };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

