import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/client';
import { saveToken, getToken, removeToken, saveUser, getUser, removeUser } from './storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      const savedUser = await getUser();
      
      if (token && savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const { token, data } = response;
      
      if (token) {
        await saveToken(token);
        await saveUser(data);
        setUser(data);
        return { success: true };
      }
      
      return { success: false, error: 'No token received' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.status?.message || 'Signup failed' 
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, status } = response;
      
      if (token && status?.data?.user) {
        await saveToken(token);
        await saveUser(status.data.user);
        setUser(status.data.user);
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Invalid credentials' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await removeToken();
      await removeUser();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};