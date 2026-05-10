import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

export const seatHoldService = {
   /**
    * Giữ ghế cho khách hàng dựa trên mã đặt vé
    */
   holdSeats: (bookingId: string, seatIds: string[]) => {
      return apiService.post<ApiResponse<any>>(`/bookings/${bookingId}/seats`, {
         seatIds,
      });
   },

   /**
    * Hủy tất cả ghế đã giữ của một booking
    */
   releaseSeats: (bookingId: string) => {
      return apiService.delete<ApiResponse<any>>(
         `/bookings/${bookingId}/seats/release-all`,
      );
   },
};
