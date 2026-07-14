export interface EmployeeResponse {
   userId: string;
   username: string;
   name: string;
   email: string;
   phone: string;
   branchId?: string;
   branchName?: string;
   employeeCode: string;
   positionId?: string;
   positionName?: string;
   salary?: number;
   hireDate?: string;
   roles?: Role[];
}

export interface EmployeeCreateRequest {
   username: string;
   password: string;
   name: string;
   email: string;
   phone: string;
   branchId: string;
   employeeCode: string;
   positionId: string;
   salary?: number;
   hireDate?: string;
}

export interface EmployeeUpdateRequest {
   salary?: number;
   hireDate?: string;
   branchId?: string;
   positionId?: string;
   name?: string;
   email?: string;
   phone?: string;
}

export interface EmployeeSearchDTO {
   name?: string;
   employeeCode?: string;
   branchId?: string;
   roleId?: string;
   page?: number;
   size?: number;
   sortBy?: string;
   sortDirection?: "ASC" | "DESC";
}

export interface TransferEmployeeRequest {
   branchId: string;
}

/** Table row type with id alias for DashboardEntityList selection */
export type Employee = EmployeeResponse & { id: string };

export interface Role {
   id: string;
   name: string;
   code: string;
}
