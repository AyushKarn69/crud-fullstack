// Axios interceptors for token refresh and 401 handling

import apiClient from "./client.js";

let authContext = null;

export const setAuthContext = (context) => {
  authContext = context;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!authContext) {
        return Promise.reject(error);
      }

      try {
        await authContext.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${authContext.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        authContext.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
