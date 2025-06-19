import { useState, useCallback } from 'react';
import { User, AuthState } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false
  });

  const login = useCallback(async (email: string, name: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (name.trim().length < 2) {
        throw new Error('Please enter your full name');
      }

      const user: User = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        name: name.trim(),
        loginTime: new Date(),
        profilePicture: '',
        phone: '',
        address: ''
      };

      // Store user data in localStorage for persistence
      localStorage.setItem('nagarPalikaUser', JSON.stringify(user));
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const updateProfile = useCallback((updatedUser: User) => {
    localStorage.setItem('nagarPalikaUser', JSON.stringify(updatedUser));
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nagarPalikaUser');
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  }, []);

  const checkAuthStatus = useCallback(() => {
    const storedUser = localStorage.getItem('nagarPalikaUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          user: {
            ...user,
            loginTime: new Date(user.loginTime)
          },
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('nagarPalikaUser');
      }
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
    updateProfile,
    checkAuthStatus
  };
};