// Authentication context for managing token state and auth operations

import React, { createContext, useState, useCallback } from "react";
import apiClient, { setAuthContext } from "../api/interceptors.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { accessToken, user: userData } = response.data.data;

      setToken(accessToken);
      setUser(userData);
      apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
      });
      return { success: true, user: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await apiClient.post("/auth/refresh");
      const { accessToken } = response.data.data;

      setToken(accessToken);
      apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
      return { success: true };
    } catch (error) {
      logout();
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.Authorization;
    apiClient.post("/auth/logout").catch(() => {});
  }, []);

  const value = {
    token,
    user,
    loading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!token,
  };

  setAuthContext(value);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
