import apiService from './apiService';

// Điều chỉnh type/interface tuỳ theo DTO trong project của bạn
export interface RoomData {
   searchTerm?: string;
   branchId?: string;
   page?: number;
   size?: number;
   // ... thêm các field khác từ openapi
}

const ROOM_API_PATH = '/room';

export const roomService = {
   /**
    * Lấy danh sách tất cả các phòng
    */
   getAllRooms: () => {
      return apiService.get(ROOM_API_PATH);
   },

   /**
    * Xem thông tin chi tiết phòng chiếu
    */
   getRoomById: (id: string) => {
      return apiService.get(`${ROOM_API_PATH}/${id}`);
   },

   /**
    * Tạo phòng chiếu mới
    */
   createRoom: (data: RoomData) => {
      return apiService.post(ROOM_API_PATH, data);
   },

   /**
    * Cập nhật thông tin phòng chiếu
    */
   updateRoom: (id: string, data: RoomData) => {
      return apiService.put(`${ROOM_API_PATH}/${id}`, data);
   },

   /**
    * Xóa mềm phòng chiếu
    */
   deleteRoom: (id: string) => {
      return apiService.delete(`${ROOM_API_PATH}/${id}`);
   },

   /**
    * Khôi phục phòng đã xóa mềm
    */
   restoreRoom: (id: string) => {
      return apiService.put(`${ROOM_API_PATH}/${id}/restore`);
   },

   /**
    * Tìm kiếm phòng chiếu theo chi nhánh (branch)
    */
   searchRoom: (data: RoomData) => {
      return apiService.post(`${ROOM_API_PATH}/search?searchTerm=${data.searchTerm}&branchId=${data.branchId}&page=${data.page}&size=${data.size}`);
   }
};
