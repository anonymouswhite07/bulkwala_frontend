// React Hook for Safari-Compatible Authentication
// Handles iOS Safari's strict cookie policies and cross-site request requirements

import { useState, useEffect, useCallback } from 'react';
import safariAuthService from '@/services/safari-auth-fix';

// Custom hook for authentication that works reliably on iOS Safari
export const useSafariAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await safariAuthService.checkAuthStatus();
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
      } else if (result.authenticated === false) {
        // Not authenticated - this is expected
        setUser(null);
        setIsLoggedIn(false);
      } else {
        // Unexpected error
        setError(result.error);
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      setError('Failed to check authentication status');
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login with email/password
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await safariAuthService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // OTP Login flow
  const sendOtp = useCallback(async (phone) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await safariAuthService.sendOtp(phone);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await safariAuthService.verifyOtp(data);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Invalid or expired OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await safariAuthService.logout();
      
      // Regardless of backend result, clear local state
      setUser(null);
      setIsLoggedIn(false);
      
      if (result.success) {
        return { success: true };
      } else {
        // Log error but still consider logout successful
        console.warn('Logout warning:', result.error);
        return { success: true };
      }
    } catch (err) {
      // Even if there's an error, clear local state
      setUser(null);
      setIsLoggedIn(false);
      
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh token manually (if needed)
  const refreshAuthToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await safariAuthService.refreshToken();
      
      if (result.success) {
        return { success: true, accessToken: result.accessToken };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Token refresh failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    user,
    isLoggedIn,
    isLoading,
    error,
    
    // Actions
    login,
    sendOtp,
    verifyOtp,
    logout,
    checkAuthStatus,
    refreshAuthToken,
    
    // Utilities
    setUser,
    setIsLoggedIn,
  };
};

export default useSafariAuth;