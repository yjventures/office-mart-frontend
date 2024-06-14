import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { showToast } from 'src/components/Common/Toastify/Toastify';

const useAuth = () => {
  // Example of retrieving user details from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // const isAuthenticated = user && user.token; // Example condition for authentication
  const userType = user ? user.type : null;

  return { userType }; //isAuthenticated
};

const PrivateRoute = ({ children, role, redirectTo = '/signin' }) => {
  const { userType } = useAuth();
  const location = useLocation();
  if (role && userType !== role) {
    // Redirect to the specified path if the user is not authorized
    useEffect(() => {
      showToast('Please signin to access this feature!', 'info')
    }, [])
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // If the user is authorized, render the children components
  return children;
};

export default PrivateRoute;