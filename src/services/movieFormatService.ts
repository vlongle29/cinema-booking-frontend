import apiService from './apiService';

const FORMAT_API_PATH = '/movie-formats';

export const movieFormatService = {
   /**
    * Lấy danh sách tất cả các định dạng
    */
   getAllFormats: () => {
      return apiService.get(FORMAT_API_PATH);
   },

   /**
    * Xem thông tin chi tiết định dạng
    */
   getFormatById: (id: string) => {
      return apiService.get(`${FORMAT_API_PATH}/${id}`);
   },

   // /**
   //  * Tạo định dạng mới
   //  */
   // createFormat: (data: RoomData) => {
   //    return apiService.post(FORMAT_API_PATH, data);
   // },

   // /**
   //  * Cập nhật thông tin định dạng
   //  */
   // updateFormat: (id: string, data: RoomData) => {
   //    return apiService.put(`${FORMAT_API_PATH}/${id}`, data);
   // },

   // /**
   //  * Xóa mềm định dạng
   //  */
   // deleteFormat: (id: string) => {
   //    return apiService.delete(`${FORMAT_API_PATH}/${id}`);
   // },

   // /**
   //  * Khôi phục định dạng đã xóa mềm
   //  */
   // restoreFormat: (id: string) => {
   //    return apiService.put(`${FORMAT_API_PATH}/${id}/restore`);
   // },

   // /**
   //  * Tìm kiếm định dạng
   //  */
   // searchFormat: (data: RoomData) => {
   //    return apiService.post(`${FORMAT_API_PATH}/search?searchTerm=${data.searchTerm}&branchId=${data.branchId}&page=${data.page}&size=${data.size}`);
   // }
};
