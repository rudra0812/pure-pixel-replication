import { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/types';
import { storage } from '@/lib/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * useAuth Hook
 * Manages authentication state with localStorage persistence
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize from storage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = storage.getUser();
        setState({
          user,
          isAuthenticated: user !== null,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication',
        });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Sign up / Register user
   */
  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Basic validation
        if (!email || !password || !name) {
          throw new Error('All fields are required');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        // Create user object
        const newUser: User = {
          id: `user_${Date.now()}`,
          name,
          email,
          createdAt: new Date().toISOString(),
        };

        // Save to storage
        storage.saveUser(newUser);

        setState({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return newUser;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  /**
   * Sign in user
   */
  const signIn = useCallback(
    async (email: string, password: string) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Basic validation
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        if (password.length < 6) {
          throw new Error('Invalid credentials');
        }

        // In a real app, this would verify against backend
        // For now, create a session user
        const sessionUser: User = {
          id: `user_${Date.now()}`,
          name: email.split('@')[0],
          email,
          createdAt: new Date().toISOString(),
        };

        storage.saveUser(sessionUser);

        setState({
          user: sessionUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return sessionUser;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    try {
      storage.clearUser();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to logout',
      }));
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    signUp,
    signIn,
    logout,
    clearError,
  };
};
