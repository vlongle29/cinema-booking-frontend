export interface Branch {
   id: string;
   name: string;
   address: string;
   managerId: string;
   managerName: string;
   cityId: string;
   cityName: string;
   createTime: string;
   updateTime: string;
   updateBy: string;
}

export interface BranchRequest {
   name: string;
   address: string;
   cityId: string;
   managerId: string;
}

export interface BranchSearchDTO {
   name?: string;
   cityId?: string;
   managerId?: string;
   page: number;
   size: number;
   sortBy?: string;
   sortDirection?: "ASC" | "DESC";
}
