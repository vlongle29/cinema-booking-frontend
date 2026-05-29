import apiService from "./apiService";
import type { ApiResponse, PageResponse } from "./apiService";
import type {
   UserInfoResponse,
   UserCreateRequest,
   UserUpdateRequest,
   UserIdRequest,
} from "../types/user";

const USER_API_PATH = "/users";

export const userService = {
   /**
    * Lấy danh sách người dùng
    * Tìm kiếm và phân trang người dùng
    */
   getAllUsers: (params?: any) => {
      // Tự xây dựng query string để đảm bảo tham số luôn nằm trên URL
      const searchParams = new URLSearchParams();
      if (params) {
         Object.entries(params).forEach(([key, value]) => {
            // Chỉ lấy các giá trị hợp lệ (không null, undefined hoặc rỗng)
            if (value !== undefined && value !== null && value !== "") {
               if (Array.isArray(value)) {
                  value.forEach((v) => searchParams.append(key, v));
               } else {
                  searchParams.append(key, String(value));
               }
            }
         });
      }
      const queryString = searchParams.toString();
      const url = `${USER_API_PATH}/search${queryString ? `?${queryString}` : ""}`;

      return apiService.get<ApiResponse<PageResponse<UserInfoResponse>>>(url);
   },

   /**
    * Tạo người dùng mới
    */
   createUser: (data: UserCreateRequest) => {
      return apiService.post<ApiResponse<UserInfoResponse>>(
         USER_API_PATH,
         data,
      );
   },

   /**
    * Lấy thông tin chi tiết người dùng
    */
   getUserById: (id: string) => {
      return apiService.get<ApiResponse<UserInfoResponse>>(
         `${USER_API_PATH}/${id}`,
      );
   },

   /**
    * Cập nhật thông tin người dùng
    */
   updateUser: (id: string, data: UserUpdateRequest) => {
      return apiService.put<ApiResponse<UserInfoResponse>>(
         `${USER_API_PATH}/${id}`,
         data,
      );
   },

   /**
    * Xóa người dùng (đơn lẻ hoặc hàng loạt)
    */
   deleteUser: (ids: string[]) => {
      // Changed to accept array of IDs for consistency with API
      return apiService.delete<ApiResponse<void>>(USER_API_PATH, {
         data: { ids },
      });
   },

   /**
    * Khóa người dùng
    */
   lockUsers: (data: UserIdRequest) => {
      return apiService.post<ApiResponse<number>>(
         `${USER_API_PATH}/lock`,
         data,
      );
   },

   /**
    * Mở khóa người dùng
    */
   unlockUsers: (data: UserIdRequest) => {
      return apiService.post<ApiResponse<number>>(
         `${USER_API_PATH}/unlock`,
         data,
      );
   },

   /**
    * Reset mật khẩu qua email
    */
   resetUserPassword: (email: string) => {
      return apiService.post<ApiResponse<void>>(
         `${USER_API_PATH}/reset-password-user`,
         { email },
      );
   },
};
