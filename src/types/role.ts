export interface RoleInfo {
   id: string;
   name: string;
   code: string;
}

export interface SysRoleResponse {
   id: string;
   code: string;
   name: string;
   description: string;
   createTime: string; // ISO date string
   updateTime: string; // ISO date string
   updateBy?: string; // UUID của người cập nhật
}

export interface RoleCreateRequest {
   name: string;
   code: string;
   description?: string;
}
