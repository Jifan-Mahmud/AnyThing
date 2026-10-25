'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const API_BASE = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get authorization headers
  const getAuthHeaders = () => {
    const headers = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  // Check session on load
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        if (data.data?.token && typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.data.token);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.error || data.code) {
        const msg = data.error?.message || data.message || 'Invalid email or password.';
        throw new Error(msg);
      }

      toast.success('Welcome back! 🎉');
      await checkSession();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // Sign up
  const signup = async (name, email, password, avatarFile, bio) => {
    try {
      if (!name.trim()) throw new Error('Name is required.');
      if (password.length < 8) throw new Error('Password must be at least 8 characters.');

      const res = await fetch(`${API_BASE}/auth/sign-up/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.error || data.code) {
        const msg = data.error?.message || data.message || 'Failed to sign up.';
        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exist')) {
          throw new Error('This email is already registered. Please log in instead.');
        }
        throw new Error(msg);
      }

      toast.success('Account created! Welcome to AnyThing 🚀');
      await checkSession();

      if (avatarFile || bio) {
        const formData = new FormData();
        if (avatarFile) {
          formData.append('avatar', avatarFile);
        }
        if (bio) {
          formData.append('bio', bio);
        }
        const updateRes = await fetch(`${API_BASE}/users/me`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: formData,
          credentials: 'include',
        });
        const updateData = await updateRes.json();
        if (updateRes.ok && updateData.success) {
          setUser(updateData.data);
        }
      }

      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore network errors on sign-out
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setUser(null);
      toast.info('Logged out successfully.');
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      toast.success('Profile updated! ✨');
      setUser(data.data);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // Sign in with Google Credential (from Google Identity Services / One-Tap / Popup)
  const signInWithGoogleCredential = async (credential) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google authentication failed');
      }

      if (data.data?.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
      setUser(data.data.user);
      toast.success('Welcome back with Google! 🎉');
      return { success: true, user: data.data.user };
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google (OAuth Redirect via better-auth)
  const signInWithGoogle = async () => {
    try {
      const callbackURL =
        typeof window !== 'undefined'
          ? `${window.location.origin}/app`
          : '/app';

      const res = await fetch(`${API_BASE}/auth/sign-in/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          callbackURL,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        const errorMsg =
          data.error?.message || data.message || 'Failed to start Google sign-in';
        throw new Error(errorMsg);
      }

      if (data.url) {
        window.location.href = data.url;
        return { success: true, redirect: true };
      }

      await checkSession();
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        signInWithGoogle,
        signInWithGoogleCredential,
        loginWithGoogle: signInWithGoogle,
        logout,
        updateProfile,
        checkSession,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
