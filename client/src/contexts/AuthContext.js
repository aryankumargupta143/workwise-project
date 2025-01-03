import React, { createContext, useState, useEffect } from 'react';
import { getUserFromToken } from '../services/authService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.token) {
        const user = await getUserFromToken(auth.token);
        if (user) {
          setAuth((prev) => ({ ...prev, user }));
        } else {
          setAuth({ token: null, user: null });
          localStorage.removeItem('token');
        }
      }
    };

    fetchUser();
  }, [auth.token]);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;