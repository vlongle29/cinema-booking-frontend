import apiService from "./apiService";

export const seatHoldService = {
   /**
    * Giữ ghế cho khách hàng dựa trên mã đặt vé
    */
   holdSeats: (bookingId: string, seatIds: string[]) => {
      return apiService.post(`/bookings/${bookingId}/seats`, {
         seatIds,
      });
   },

   /**
    * Hủy tất cả ghế đã giữ của một booking
    */
   releaseSeats: (bookingId: string) => {
      return apiService.delete(`/bookings/${bookingId}/seats/release-all`);
   },
};
