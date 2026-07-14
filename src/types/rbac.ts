// ============================================================
// SysRole Types
// ============================================================
export interface SysRole {
  id: string;
  code: string;
  name: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
  updateBy?: string;
}

export interface SysRoleRequest {
  id?: string;
  name: string;
  code: string;
  description?: string;
}

export interface SysRoleSearchDTO {
  page: number;
  size: number;
  name?: string;
  code?: string;
}

// ============================================================
// SysPermission Types
// ============================================================
export interface SysPermission {
  id: string;
  permission: string;
  description?: string;
}

export interface SysPermissionRequest {
  id?: string;
  permission: string;
  description?: string;
}

export interface SysPermissionSearchDTO {
  page: number;
  size: number;
  permission?: string;
  roleId?: string;
}

// ============================================================
// Assign Permission Request
// ============================================================
export interface AssignPermissionsRequest {
  roleId: string;
  permissionIds: string[];
}
