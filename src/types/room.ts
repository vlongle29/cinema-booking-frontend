export type RoomType = '2D' | '3D' | 'IMAX';
export interface Room {
   id: string;              
   branchId: string;
   name: string;
   capacity: number;
   type: RoomType;
   openTime: string;        
   closeTime: string;
   seatTemplateId?: string; 
   createTime?: string;     
   updateTime?: string;
}