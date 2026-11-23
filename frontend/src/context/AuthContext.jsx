import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { AuthContext } from './context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login gagal' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      console.log("Token sudah tidak valid di server, tetap lanjut logout.");
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};