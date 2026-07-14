import apiService from "@/services/apiService";
import type { ApiResponse } from "@/services/apiService";
import type {
  SysRole,
  SysRoleRequest,
  SysRoleSearchDTO,
  SysPermission,
  SysPermissionRequest,
  SysPermissionSearchDTO,
  AssignPermissionsRequest,
} from "@/types/rbac";

const ROLE_API = "/roles";
const PERMISSION_API = "/permissions";

// ============================================================
// Role Service
// ============================================================
export const sysRoleService = {
  /** Lấy tất cả roles (dùng cho dropdown) */
  getAll: () => apiService.get<ApiResponse<SysRole[]>>(ROLE_API),

  /** Chi tiết role theo id */
  getById: (id: string) =>
    apiService.get<ApiResponse<SysRole>>(`${ROLE_API}/${id}`),

  /** Tìm kiếm phân trang */
  search: (params: SysRoleSearchDTO) =>
    apiService.get<ApiResponse<any>>(`${ROLE_API}/search`, { params }),

  /** Tạo role mới */
  create: (data: SysRoleRequest) =>
    apiService.post<ApiResponse<SysRole>>(ROLE_API, data),

  /** Cập nhật role */
  update: (data: SysRoleRequest) =>
    apiService.put<ApiResponse<SysRole>>(ROLE_API, data),

  /** Xóa một hoặc nhiều roles */
  deleteRoles: (roleIds: string[]) =>
    apiService.delete<ApiResponse<void>>(ROLE_API, { data: { roleIds } }),

  /** Gán permissions cho role */
  assignPermissions: (request: AssignPermissionsRequest) =>
    apiService.post<ApiResponse<void>>(
      `${ROLE_API}/assign-permissions`,
      request,
    ),

  /** Lấy danh sách permissions của role */
  getPermissionsByRole: (roleId: string) =>
    apiService.get<ApiResponse<SysPermission[]>>(
      `${ROLE_API}/${roleId}/permissions`,
    ),
};

// ============================================================
// Permission Service
// ============================================================
export const sysPermissionService = {
  /** Tìm kiếm phân trang */
  search: (params: SysPermissionSearchDTO) =>
    apiService.post<ApiResponse<any>>(`${PERMISSION_API}/search`, params),

  /** Chi tiết permission theo id */
  getById: (id: string) =>
    apiService.get<ApiResponse<SysPermission>>(`${PERMISSION_API}/${id}`),

  /** Tạo permission mới */
  create: (data: SysPermissionRequest) =>
    apiService.post<ApiResponse<SysPermission>>(PERMISSION_API, data),

  /** Cập nhật permission */
  update: (data: SysPermissionRequest) =>
    apiService.put<ApiResponse<SysPermission>>(PERMISSION_API, data),

  /** Xóa permission theo id */
  delete: (id: string) =>
    apiService.delete<ApiResponse<void>>(`${PERMISSION_API}/${id}`),

  /** Xóa nhiều permissions */
  deleteBatch: (ids: string[]) =>
    apiService.delete<ApiResponse<void>>(`${PERMISSION_API}/batch`, {
      data: ids,
    }),
};
