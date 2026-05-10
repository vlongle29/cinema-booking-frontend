import apiService from "./apiService"; // Sử dụng apiService
import type { ApiResponse } from "./apiService";
import type { SysRoleResponse } from "../types/role";

const ROLE_API_PATH = "/roles";

export const roleService = {
   // Đổi tên export từ roleApi sang roleService
   /**
    * Lấy danh sách tất cả vai trò (Dùng cho dropdown gán vai trò)
    */
   getAllRoles: () =>
      apiService.get<ApiResponse<SysRoleResponse[]>>(ROLE_API_PATH),
};
