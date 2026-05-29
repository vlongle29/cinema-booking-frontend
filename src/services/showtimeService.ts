import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const SHOWTIME_API_PATH = "/showtimes";

export const showtimeService = {
   /**
    * Lấy danh sách định dạng hoặc phân trang (nếu có)
    */
   getAllShowtimes: (params?: any) => {
      return apiService.get<ApiResponse<any>>(SHOWTIME_API_PATH, { params });
   },

   /**
    * Tìm kiếm suất chiếu (phân trang)
    */
   searchShowtimes: (params?: any) => {
      return apiService.get<ApiResponse<any>>(`${SHOWTIME_API_PATH}/search`, {
         params,
      });
   },

   /**
    * Xem chi tiết suất chiếu
    */
   getShowtimeById: (id: string) => {
      return apiService.get<ApiResponse<any>>(`${SHOWTIME_API_PATH}/${id}`);
   },

   /**
    * Thêm suất chiếu mới
    */
   createShowtime: (data: any) => {
      return apiService.post<ApiResponse<any>>(SHOWTIME_API_PATH, data);
   },

   /**
    * Cập nhật suất chiếu
    */
   updateShowtime: (id: string, data: any) => {
      return apiService.put<ApiResponse<any>>(
         `${SHOWTIME_API_PATH}/${id}`,
         data,
      );
   },

   /**
    * Xoá suất chiếu
    */
   deleteShowtime: (id: string) => {
      return apiService.delete<ApiResponse<any>>(`${SHOWTIME_API_PATH}/${id}`);
   },

   /**
    * Get detail showing time by ID, including movie, room, branch, etc.
    */
   getShowtimeDetails: (id: string) => {
      return apiService.get<ApiResponse<any>>(`${SHOWTIME_API_PATH}/${id}`);
   },

   /**

    */

   /**
    * Lấy danh sách các ghế  với trạng thái
    * @param movieId
    * @returns
    */
   getAllSeatStatus: (showtimeId: string) => {
      return apiService.get<ApiResponse<any>>(
         `${SHOWTIME_API_PATH}/${showtimeId}/seats`,
      );
   },

   /**
    * Lấy danh sách ngày có suất chiếu
    */
   getAvailableDate: (movieId: string) => {
      return apiService.get<ApiResponse<any>>(
         `${SHOWTIME_API_PATH}/available-dates?movieId=${movieId}`,
      );
   },

   /**
    * Lấy danh sách thành phố có suất chiếu
    */
   getAvailableCity: (movieId: string, date: string) => {
      return apiService.get<ApiResponse<any>>(
         `${SHOWTIME_API_PATH}/available-cities?movieId=${movieId}&date=${date}`,
      );
   },

   /**
    * Lấy danh sách định dạng có suất chiếu
    */
   getAvailableFormat: (movieId: string, date: string, cityId: string) => {
      return apiService.get<ApiResponse<any>>(
         `${SHOWTIME_API_PATH}/available-formats?movieId=${movieId}&date=${date}&cityId=${cityId}`,
      );
   },

   /**
    * Lấy danh sách suất chiếu theo rạp
    */
   getAvailableShowtimes: (
      movieId: string,
      date: string,
      cityId: string,
      format: string,
   ) => {
      return apiService.get<ApiResponse<any>>(
         `${SHOWTIME_API_PATH}/grouped-by-branch?movieId=${movieId}&date=${date}&cityId=${cityId}&format=${format}`,
      );
   },
};
