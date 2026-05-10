import apiService from "./apiService";

const USER_API_PATH = "/users";

/**
 * Types merged from user.ts
 */
export interface PageResponse<T> {
   content: T[];
   pageNumber: number;
   pageSize: number;
   totalElements: number;
   totalPages: number;
   first: boolean;
   last: boolean;
   empty: boolean;
}

export interface RoleInfo {
   id: string;
   name: string;
   code: string;
}

export interface UserInfoResponse {
   id: string;
   username: string;
   name: string;
   email: string;
   phone: string;
   avatar?: string;
   lockFlag: string; // "0" = Active, "1" = Locked
   systemFlag: string;
   roles: RoleInfo[];
}

export interface SysUserSearchDTO {
   username?: string;
   email?: string;
   name?: string;
   phone?: string;
   lockFlag?: "LOCK" | "UNLOCK" | null;
   roleIds?: string[];
   ids?: string[];
   pageNumber: number;
   pageSize: number;
   sortBy?: string;
   sortDirection?: "ASC" | "DESC";
}

export interface UserCreateRequest {
   username: string;
   password: string;
   name: string;
   email: string;
   phone: string;
   avatar?: string;
   roleIds: string[];
   branchId: string;
}

export interface UserUpdateRequest extends Partial<UserCreateRequest> {
   lockFlag?: string;
}

export interface UserIdRequest {
   ids: string[];
}

export const userService = {
   /**
    * Lấy danh sách người dùng
    * Tìm kiếm và phân trang người dùng
    */
   getAllUsers: (params?: any) => {
      return apiService.post<ApiResponse<PageResponse<UserInfoResponse>>>(
         `${USER_API_PATH}/search`,
         params,
      );
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
