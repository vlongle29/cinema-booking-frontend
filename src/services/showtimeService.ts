import apiService from './apiService';

const SHOWTIME_API_PATH = '/showtimes';

export const showtimeService = {
   /**
    * Lấy danh sách định dạng hoặc phân trang (nếu có)
    */
   getAllShowtimes: (params?: any) => {
      return apiService.get(SHOWTIME_API_PATH, { params });
   },

   /**
    * Xem chi tiết suất chiếu
    */
   getShowtimeById: (id: string) => {
      return apiService.get(`${SHOWTIME_API_PATH}/${id}`);
   },

   /**
    * Thêm suất chiếu mới
    */
   createShowtime: (data: any) => {
      return apiService.post(SHOWTIME_API_PATH, data);
   },

   /**
    * Cập nhật suất chiếu
    */
   updateShowtime: (id: string, data: any) => {
      return apiService.put(`${SHOWTIME_API_PATH}/${id}`, data);
   },

   /**
    * Xoá suất chiếu
    */
   deleteShowtime: (id: string) => {
      return apiService.delete(`${SHOWTIME_API_PATH}/${id}`);
   },

   /**
    * Lấy danh sách ngày có suất chiếu
    */
   getAvailableDate: (movieId: string) => {
      return apiService.get(`${SHOWTIME_API_PATH}/available-dates?movieId=${movieId}`);
   },

   /**
    * Lấy danh sách thành phố có suất chiếu
    */
   getAvailableCity: (movieId: string, date: string) => {
      return apiService.get(`${SHOWTIME_API_PATH}/available-cities?movieId=${movieId}&date=${date}`);
   },

   /**
    * Lấy danh sách định dạng có suất chiếu
    */
   getAvailableFormat: (movieId: string, date: string, cityId: string) => {
      return apiService.get(`${SHOWTIME_API_PATH}/available-formats?movieId=${movieId}&date=${date}&cityId=${cityId}`);
   },

   /**
    * Lấy danh sách suất chiếu theo rạp
    */
   getAvailableShowtimes: (movieId: string, date: string, cityId: string, format: string) => {
      return apiService.get(`${SHOWTIME_API_PATH}/grouped-by-branch?movieId=${movieId}&date=${date}&cityId=${cityId}&format=${format}`);
   }
};
