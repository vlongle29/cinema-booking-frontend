import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance, { setAccessToken } from "../api/axiosInstance";
import type { User, AuthResponse, AuthContextType } from "../types/auth";


export const AuthContext = createContext<AuthContextType | undefined>(
   undefined,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
   children,
}) => {
   const [userInfo, setUserInfo] = useState<User | null>(null);
   const [accessToken, setAccessTokenState] = useState<string | null>(null);
   const [permissions, setPermissions] = useState<string[]>([]);
   const [loading, setLoading] = useState(true);

   const initAuth = async () => {
      try {
         const response = await axiosInstance.post<AuthResponse>(
            "/auth/refresh-token",
         );

         const { accessToken, userInfo, permissions } = response.data.data;
         console.log(">>> [AuthContext] init Auth", response.data.data);
         
         setAccessToken(accessToken);
         setAccessTokenState(accessToken);
         setUserInfo(userInfo);
         setPermissions(permissions ?? []);
      } catch (error: any) {
         setAccessToken(null);
         setAccessTokenState(null);
         setUserInfo(null);
         setPermissions([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      initAuth();

      // Listen for forced logout events triggered by axios interceptors (refresh token expired)
      const handleLogoutEvent = () => {
         setAccessToken(null);
         setAccessTokenState(null);
         setUserInfo(null);
         setPermissions([]);
      };

      const handleLoginEvent = () => initAuth();

      window.addEventListener("auth:logout", handleLogoutEvent);
      window.addEventListener("auth:login", handleLoginEvent);
      return () => {
         window.removeEventListener("auth:logout", handleLogoutEvent);
         window.removeEventListener("auth:login", handleLoginEvent);
      };
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
      setAccessTokenState(accessToken);
      setUserInfo(userInfo);
      setPermissions(permissions ?? []);
   };

   const setAuthData = (data: {
      accessToken: string;
      userInfo: User;
      permissions?: string[];
   }) => {
      setAccessToken(data.accessToken);
      setUserInfo(data.userInfo);
      setPermissions(data.permissions ?? []);
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

   // CHẶN RENDER KHI CHƯA LẤY TOKEN XONG
   if (loading) {
      return (
         <div className="bg-[#09090b] min-h-screen flex items-center justify-center text-white">
            <div className="animate-pulse">Đang khởi tạo ứng dụng...</div>
         </div>
      );
   }

   return (
      <AuthContext.Provider
         value={{
            accessToken,
            userInfo,
            permissions,
            isAuthenticated: !!userInfo,
            loading,
            login,
            setAuthData,
            register,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};
