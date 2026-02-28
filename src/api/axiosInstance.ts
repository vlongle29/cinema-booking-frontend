import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
   baseURL: API_URL,
   withCredentials: true,
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
            const response = await axios.post(
               `${API_URL}/auth/refresh-token`,
               {},
               { withCredentials: true },
            );
            console.log("Token refreshed successfully", response.data.data);
            const newAccessToken = response.data.data.accessToken;
            setAccessToken(newAccessToken);
            onRefreshed(newAccessToken);
            isRefreshing = false;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
         } catch (refreshError) {
            isRefreshing = false;
            setAccessToken(null);
            // Dispatch event to logout user across the app
            window.dispatchEvent(new Event("auth:logout"));
            return Promise.reject(refreshError);
         }
      }
      return Promise.reject(error);
   },
);

export default axiosInstance;
