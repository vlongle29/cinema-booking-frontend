import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = "http://localhost:8080/api";

/**
 * Axios instance for all API calls.
 *
 * Auth strategy:
 *  - Login  → backend sets `sessionId` + `refreshToken` as httpOnly cookies.
 *  - Every request → `accessToken` is attached via the request interceptor below (in-memory only).
 *  - On 401 → the response interceptor calls /auth/refresh-token.
 *    The browser sends the httpOnly cookies automatically (withCredentials: true).
 *    Backend rotates both cookies and returns a new accessToken in JSON.
 */
const axiosInstance = axios.create({
   baseURL: API_URL,
   withCredentials: true, // Required so httpOnly cookies (sessionId, refreshToken) are sent to the backend
   headers: {
      "Content-Type": "application/json",
   },
});

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export const setAccessToken = (token: string | null) => {
   accessToken = token;
};

const onRefreshed = (token: string) => {
   // Reset BEFORE notifying so any new 401s that fire during notification start a fresh refresh cycle
   isRefreshing = false;
   refreshSubscribers.forEach((cb) => cb(token));
   refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
   refreshSubscribers.push(cb);
};

axiosInstance.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      if (accessToken) {
         config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
   },
   (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
   (response) => response,
   async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
         _retry?: boolean;
      };

      // Prevent infinite loops: if the failed request was the refresh endpoint, don't try to refresh again
      if (originalRequest.url?.includes("/auth/refresh-token")) {
         return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
         if (isRefreshing) {
            return new Promise((resolve) => {
               addRefreshSubscriber((token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(axiosInstance(originalRequest));
               });
            });
         }

         originalRequest._retry = true;
         isRefreshing = true;

         try {
            console.log("🔄 [Auth] Attempting to refresh token...");
            console.log("📤 [Auth] Request: POST /auth/refresh-token (withCredentials: true)");
            // Note: httpOnly cookies are sent automatically by the browser and are NOT accessible via JavaScript console.

            const response = await axios.post(
               `${API_URL}/auth/refresh-token`,
               undefined,
               { withCredentials: true },
            );
            
            console.log("✅ [Auth] Token refreshed successfully!");
            console.log("📥 [Auth] Response Data:", response.data);
            
            const newAccessToken = response.data.data.accessToken;
            setAccessToken(newAccessToken);
            onRefreshed(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
         } catch (refreshError: any) {
            console.error("❌ [Auth] Refresh token failed:", refreshError.response?.data || refreshError.message);
            isRefreshing = false;
            setAccessToken(null);
            window.dispatchEvent(new Event("auth:logout"));
            return Promise.reject(refreshError);
         }
      }
      return Promise.reject(error);
   },
);

export default axiosInstance;
