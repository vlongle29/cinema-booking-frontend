import apiService from "./apiService";
import type { ApiResponse } from "./apiService"; // Import ApiResponse từ apiService
import type {
   BookingCheckoutData,
   BookingSearchResponse,
   PaymentMethod,
   ProductItem,
} from "../types/booking";

const BOOKING_API_PATH = "/booking";

export const bookingService = {
   /**
    * Lấy danh sách lượt đặt vé
    */
   getAllBookings: (params?: any) => {
      return apiService.get<ApiResponse<any>>(BOOKING_API_PATH, { params });
   },

   /**
    * Delete booking
    */
   deleteBooking: (id: string) => {
      return apiService.delete<ApiResponse<any>>(`${BOOKING_API_PATH}/${id}`);
   },
   

   /**
    * Get detail of a booking by ID
    */
   getBookingDetails: (id: string) => {
      return apiService.get<ApiResponse<any>>(`${BOOKING_API_PATH}/${id}`);
   },

   /**
    * Lấy danh sách đặt vé
    */
   searchBookings: (
      params?: any, // apiService.get trả về Promise<ApiResponse<T>>
   ) => {
      return apiService.get<ApiResponse<BookingSearchResponse>>(
         `${BOOKING_API_PATH}/search`,
         { params },
      );
   },

   /**
    * Xem chi tiết đặt vé
    */
   getBookingById: (id: string) => {
      return apiService.get<ApiResponse<any>>(`${BOOKING_API_PATH}/${id}`);
   },

   /**
    * Tạo lệnh đặt vé mới
    */
   createBooking: (data: any) => {
      return apiService.post<ApiResponse<any>>(BOOKING_API_PATH, data);
   },

   /**
    * Hủy vé / Cập nhật trạng thái
    */
   updateBookingStatus: (id: string, statusData: any) => {
      return apiService.put<ApiResponse<any>>(
         `${BOOKING_API_PATH}/${id}/status`,
         statusData,
      );
   },

   /**
    * Tạo lệnh đặt vé nháp
    */
   createDraftBooking: (showtimeId: any) => {
      return apiService.post<ApiResponse<any>>(`${BOOKING_API_PATH}/draft`, {
         showtimeId,
      });
   },

   /**
    * Confirm booking
    */
   confirmBooking: (
      showtimeId: string,
      seatIds: string[],
      products: ProductItem[],
   ) => {
      return apiService.post<ApiResponse<any>>(`${BOOKING_API_PATH}/confirm`, {
         showtimeId,
         seatIds,
         products,
      });
   },

   /**
    * Checkout
    */
   checkoutBooking: (
      bookingId: string,
      data: BookingCheckoutData | PaymentMethod,
   ) => {
      // Nếu data truyền vào là string (tên phương thức), tự động wrap thành object
      const requestData =
         typeof data === "string" ? { paymentMethod: data } : data;

      return apiService.put<ApiResponse<any>>(
         `${BOOKING_API_PATH}/${bookingId}/checkout`,
         requestData,
      );
   },

   /**
    * Cancel Booking
    */
   cancelBooking: (bookingId: string, reason: string) => {
      return apiService.post<ApiResponse<any>>(
         `${BOOKING_API_PATH}/${bookingId}/cancel`,
         {
            reason,
         },
      );
   },

   getMyBookings: () => {
      return apiService.get<ApiResponse<any>>(
         `${BOOKING_API_PATH}/my-bookings`,
      );
   },
};
