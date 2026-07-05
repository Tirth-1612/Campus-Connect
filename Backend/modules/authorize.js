export default function authorize(allowedRoles = []) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (roles.length === 0 || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
}
