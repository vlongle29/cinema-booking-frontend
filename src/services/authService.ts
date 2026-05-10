import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const AUTH_API_PATH = "/auth";

export const authService = {
   /**
    * Đăng nhập
    */
   login: (data: any) => {
      // Giả định data là object chứa username/password
      return apiService.post<ApiResponse<any>>(`${AUTH_API_PATH}/login`, data);
   },

   /**
    * Đăng ký tài khoản mới
    */
   register: (data: any) => {
      return apiService.post<ApiResponse<any>>(
         `${AUTH_API_PATH}/register`,
         data,
      );
   },

   /**
    * Làm mới token
    */
   refreshToken: () => {
      // Endpoint may vary, usually handled by axios interceptor automatically, or return ApiResponse<any>
      return apiService.post<ApiResponse<any>>(
         `${AUTH_API_PATH}/refresh-token`,
      );
   },

   /**
    * Đăng xuất
    */
   logout: () => {
      return apiService.post<ApiResponse<any>>(`${AUTH_API_PATH}/logout`);
   },

   /**
    * Lấy thông tin người dùng hiện tại
    */
   getCurrentUser: () => {
      return apiService.get<ApiResponse<any>>(`${AUTH_API_PATH}/info`, {
         withCredentials: true, // Ensure cookies are sent for authentication
      });
   },
};
