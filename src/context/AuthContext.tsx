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
      // sessionId & refreshToken are @JsonIgnore on backend — they come as httpOnly cookies, NOT in JSON
      accessToken: string;
      userInfo: User;
      permissions: string[];
   };
}

interface AuthContextType {
   userInfo: User | null;
   permissions: string[];
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
   const [permissions, setPermissions] = useState<string[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const initAuth = async () => {
         try {
            const response = await axiosInstance.post<AuthResponse>("/auth/refresh-token");
            
            const { accessToken, userInfo, permissions } = response.data.data;
            setAccessToken(accessToken);
            setUserInfo(userInfo);
            setPermissions(permissions ?? []);
         } catch (error: any) {
            setAccessToken(null);
            setUserInfo(null);
            setPermissions([]);
         } finally {
            setLoading(false);
         }
      };

      initAuth();

      // Listen for forced logout events triggered by axios interceptors (refresh token expired)
      const handleLogoutEvent = () => {
         setAccessToken(null);
         setUserInfo(null);
         setPermissions([]);
      };

      window.addEventListener("auth:logout", handleLogoutEvent);
      return () => window.removeEventListener("auth:logout", handleLogoutEvent);
   }, []);

   const login = async (credentials: any) => {
      // withCredentials: true is set globally on axiosInstance
      // Backend will respond with Set-Cookie (sessionId + refreshToken as httpOnly)
      const response = await axiosInstance.post<AuthResponse>(
         "/auth/login",
         credentials,
      );
      const { accessToken, userInfo, permissions } = response.data.data;

      setAccessToken(accessToken);
      setUserInfo(userInfo);
      setPermissions(permissions ?? []);
   };

   const register = async (data: any) => {
      await axiosInstance.post("/auth/register", data);
   };

   const logout = async (currentAccessToken?: string) => {
      try {
         // Backend requires Authorization header for the logout endpoint
         await axiosInstance.post("/auth/logout", undefined, {
            headers: {
               // Pass the current accessToken explicitly if provided,
               // otherwise axiosInstance request interceptor will attach it automatically
               ...(currentAccessToken
                  ? { Authorization: `Bearer ${currentAccessToken}` }
                  : {}),
            },
         });
      } catch (error) {
         console.error("Logout failed", error);
      } finally {
         setAccessToken(null);
         setUserInfo(null);
         setPermissions([]);
      }
   };

   return (
      <AuthContext.Provider
         value={{
            userInfo,
            permissions,
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
