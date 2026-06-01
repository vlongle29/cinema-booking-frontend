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
   lockFlag?: "LOCK" | "NORMAL" | null;
   roleIds?: string[];
   ids?: string[];
   pageNumber: number; // Bắt đầu từ 0
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
