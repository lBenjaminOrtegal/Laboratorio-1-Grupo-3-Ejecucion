import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from './Spinner';

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: 'PRODUCTOR' | 'ASISTENTE';
}

export function ProtectedRoute({ element, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{element}</>;
}
