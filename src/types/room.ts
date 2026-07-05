export interface Room {
   id: string;
   name: string;
   totalSeats: number;
   branchId: string;
   branchName?: string;
   openTime?: string;   // "HH:mm:ss" format from backend LocalTime
   closeTime?: string;
   createTime?: string;
   updateTime?: string;
}

export interface RoomRequest {
   name: string;
   totalSeats: number;
   branchId: string;
   openTime?: string;
   closeTime?: string;
}

export interface RoomSearchDTO {
   name?: string;
   branchId?: string;
   isDeleted?: boolean | string;
   page: number;
   size: number;
   sortBy?: string;
   sortDirection?: "ASC" | "DESC";
}