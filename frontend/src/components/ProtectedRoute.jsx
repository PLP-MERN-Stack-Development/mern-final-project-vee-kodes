import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Standard protection: Must be logged in
const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user's role is included
  if (roles && !roles.includes(user.role)) {
     // Redirect to home/dashboard if role doesn't match
     return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;