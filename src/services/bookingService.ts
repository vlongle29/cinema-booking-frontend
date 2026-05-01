import apiService from "./apiService";

const BOOKING_API_PATH = "/booking";

interface ProductItem {
   productId: string;
   quantity: number;
   priceAtPurchase: number;
}

/** Các phương thức thanh toán hỗ trợ */
export type PaymentMethod =
   | "CASH"
   | "CREDIT_CARD"
   | "E_WALLET"
   | "momo"
   | "zalopay"
   | "vnpay"
   | "NCB"
   | string;

export interface BookingCheckoutData {
   promotionId?: string;
   giftCardCode?: string;
   paymentMethod: PaymentMethod;
}

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
   },

   /**
    * Tạo lệnh đặt vé nháp
    */
   createDraftBooking: (showtimeId: any) => {
      return apiService.post(`${BOOKING_API_PATH}/draft`, { showtimeId });
   },

   /**
    * Confirm booking
    */
   confirmBooking: (
      showtimeId: string,
      seatIds: string[],
      products: ProductItem[],
   ) => {
      return apiService.post(`${BOOKING_API_PATH}/confirm`, {
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

      return apiService.put(
         `${BOOKING_API_PATH}/${bookingId}/checkout`,
         requestData,
      );
   },

   /**
    * Cancel Booking
    */
   cancelBooking: (bookingId: string, reason: string) => {
      return apiService.post(`${BOOKING_API_PATH}/${bookingId}/cancel`, {
         reason,
      });
   },
};
