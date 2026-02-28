import apiService from './apiService';

const AUTH_API_PATH = '/auth';

export const authService = {
   /**
    * Đăng nhập
    */
   login: (data: any) => {
      return apiService.post(`${AUTH_API_PATH}/login`, data);
   },

   /**
    * Đăng ký tài khoản mới
    */
   register: (data: any) => {
      return apiService.post(`${AUTH_API_PATH}/register`, data);
   },

   /**
    * Làm mới token
    */
   refreshToken: () => {
      // Endpoint may vary, usually handled by axios interceptor automatically
      return apiService.post(`${AUTH_API_PATH}/refresh-token`);
   },

   /**
    * Đăng xuất
    */
   logout: () => {
      return apiService.post(`${AUTH_API_PATH}/logout`);
   },
   
   /**
    * Lấy thông tin người dùng hiện tại
    */
   getCurrentUser: () => {
      return apiService.get(`${AUTH_API_PATH}/me`);
   }
};
