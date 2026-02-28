import apiService from './apiService';

const BOOKING_API_PATH = '/bookings';

export const bookingService = {
   /**
    * Lấy danh sách lượt đặt vé
    */
   getAllBookings: (params?: any) => {
      return apiService.get(BOOKING_API_PATH, { params });
   },

   /**
    * Xem chi tiết đặt vé
    */
   getBookingById: (id: string) => {
      return apiService.get(`${BOOKING_API_PATH}/${id}`);
   },

   /**
    * Tạo lệnh đặt vé mới
    */
   createBooking: (data: any) => {
      return apiService.post(BOOKING_API_PATH, data);
   },

   /**
    * Hủy vé / Cập nhật trạng thái
    */
   updateBookingStatus: (id: string, statusData: any) => {
      return apiService.put(`${BOOKING_API_PATH}/${id}/status`, statusData);
   }
};
