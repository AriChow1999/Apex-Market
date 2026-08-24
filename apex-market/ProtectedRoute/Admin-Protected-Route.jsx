import { Navigate } from 'react-router-dom';
import { useAuthStore } from './../src/store/ZustandStore';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const {user}=useAuthStore();

  const isAdmin = token && user?.isAdmin==true;


  // If no token exists, redirect user away from the protected page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;