import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'Admin') {
    // If not admin, redirect to '/farmers' page if the user is a Field Officer
    return <Navigate to="/farmers" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;