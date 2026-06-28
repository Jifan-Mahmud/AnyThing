import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const API_BASE = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Check session on load ────────────────────────────────────────────────────
  const checkSession = async () => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/sign-in/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      // better-auth returns 200 with an error object OR 4xx — handle both
      if (!res.ok || data.error || data.code) {
        const msg = data.error?.message || data.message || "Invalid email or password.";
        throw new Error(msg);
      }

      toast.success("Welcome back! 🎉");
      await checkSession();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // ── Sign up ──────────────────────────────────────────────────────────────────
  const signup = async (name, email, password, avatarFile, bio) => {
    try {
      // Basic client-side validation
      if (!name.trim()) throw new Error("Name is required.");
      if (password.length < 8) throw new Error("Password must be at least 8 characters.");

      const res = await fetch(`${API_BASE}/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await res.json();

      // better-auth may return 200 with an error field, or a real 4xx
      if (!res.ok || data.error || data.code) {
        const msg = data.error?.message || data.message || "Failed to sign up.";
        // Friendly messages for common errors
        if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exist")) {
          throw new Error("This email is already registered. Please log in instead.");
        }
        throw new Error(msg);
      }

      toast.success("Account created! Welcome to AnyThing 🚀");
      // After sign-up, better-auth sets the session cookie — fetch the profile
      await checkSession();

      // If user uploaded a profile picture or bio at signup, update it now
      if (avatarFile || bio) {
        const formData = new FormData();
        if (avatarFile) {
          formData.append("avatar", avatarFile);
        }
        if (bio) {
          formData.append("bio", bio);
        }
        const updateRes = await fetch(`${API_BASE}/users/me`, {
          method: "PATCH",
          body: formData,
          credentials: "include",
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

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore errors — clear state regardless
    } finally {
      setUser(null);
      toast.info("Logged out successfully.");
    }
  };

  // ── Update profile (name / bio / avatar) ─────────────────────────────────────
  const updateProfile = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PATCH",
        body: formData, // FormData — browser sets Content-Type + boundary automatically
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      toast.success("Profile updated! ✨");
      setUser(data.data);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
