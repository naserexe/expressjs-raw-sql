import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import { loadUserAPI } from './utils/loadUser';
import { userAtom } from './atom'
import setAuthToken from './utils/setAuthToken';

export const PrivateRoute = ({ children }) => {
  const [currentUser, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = currentUser.isAuthenticated;

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      if (localStorage.e_token) {
        try {
          setAuthToken(localStorage.e_token);
          const { user } = await loadUserAPI();
          setUser({ user, isAuthenticated: true });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false)
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace />;
  }

  return children;
};

export default PrivateRoute;
