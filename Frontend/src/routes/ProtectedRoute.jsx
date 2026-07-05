import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && roles.length && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
