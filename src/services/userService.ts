import apiService from './apiService';

const USER_API_PATH = '/users';

export const userService = {
   /**
    * Lấy danh sách người dùng
    */
   getAllUsers: (params?: any) => {
      return apiService.get(USER_API_PATH, { params });
   },

   /**
    * Lấy thông tin chi tiết người dùng
    */
   getUserById: (id: string) => {
      return apiService.get(`${USER_API_PATH}/${id}`);
   },

   /**
    * Cập nhật thông tin người dùng
    */
   updateUser: (id: string, data: any) => {
      return apiService.put(`${USER_API_PATH}/${id}`, data);
   },

   /**
    * Xóa quyền truy cập / xóa người dùng
    */
   deleteUser: (id: string) => {
      return apiService.delete(`${USER_API_PATH}/${id}`);
   }
};
