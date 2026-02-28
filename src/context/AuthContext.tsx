import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance, { setAccessToken } from "../api/axiosInstance";

export interface User {
   id: string;
   username: string;
   name: string;
   email: string;
   phone: string;
   avatar: string | null;
   lockFlag: string;
   systemFlag: string;
   roles: {
      id: string;
      name: string;
      code: string;
   }[];
}

interface AuthResponse {
   success: boolean;
   message: string;
   code: string;
   status: number;
   data: {
      accessToken: string;
      userInfo: User;
      permissions: any[];
      sessionId: string;
   };
}

interface AuthContextType {
   userInfo: User | null;
   isAuthenticated: boolean;
   loading: boolean;
   login: (credentials: any) => Promise<void>;
   register: (data: any) => Promise<void>;
   logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
   undefined,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
   children,
}) => {
   const [userInfo, setUserInfo] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const initAuth = async () => {
         try {
            // Attempt to refresh token on load
            const response =
               await axiosInstance.post<AuthResponse>("/auth/refresh-token");
            const { accessToken, userInfo } = response.data.data;
            setAccessToken(accessToken);
            setUserInfo(userInfo);
         } catch (error) {
            // If refresh fails, userInfo is not authenticated
            setAccessToken(null);
            setUserInfo(null);
         } finally {
            setLoading(false);
         }
      };

      initAuth();

      // Listen for logout events triggered by axios interceptors
      const handleLogoutEvent = () => {
         setAccessToken(null);
         setUserInfo(null);
      };

      window.addEventListener("auth:logout", handleLogoutEvent);
      return () => window.removeEventListener("auth:logout", handleLogoutEvent);
   }, []);

   const login = async (credentials: any) => {
      const response = await axiosInstance.post<AuthResponse>(
         "/auth/login",
         credentials,
      );
      const { accessToken, userInfo } = response.data.data;

      setAccessToken(accessToken);
      setUserInfo(userInfo);

      console.log("Login successful:", response.data);
      console.log("Access Token:", accessToken);
      console.log("User Info:", userInfo);
   };

   const register = async (data: any) => {
      await axiosInstance.post("/auth/register", data);
   };

   const logout = async () => {
      try {
         await axiosInstance.post("/auth/logout");
      } catch (error) {
         console.error("Logout failed", error);
      } finally {
         setAccessToken(null);
         setUserInfo(null);
      }
   };

   return (
      <AuthContext.Provider
         value={{
            userInfo,
            isAuthenticated: !!userInfo,
            loading,
            login,
            register,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};
