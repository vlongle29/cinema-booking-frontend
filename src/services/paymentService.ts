import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const PAYMENT_API_PATH = "/payments";

export interface PaymentSearchParams {
   amount?: string;
   bankCode?: string;
   bookingId?: string;
}

export interface SeatPaymentDetail {
   seatNumber: string;
   seatType: string;
   price: number;
}

export interface ProductPaymentDetail {
   name: string;
   quantity: number;
   price: number;
}

export interface ShowtimePaymentDetail {
   movieTitle: string;
   branchName: string;
   roomName: string;
   startTime: string;
   cityName: string;
   posterUrl?: string;
}

export interface PaymentTransactionInfo {
   totalTicketPrice: number;
   totalFoodPrice: number;
   discountAmount: number;
   finalAmount: number;
   paymentMethod: string;
   transactionCode: string;
   paymentTime: string;
}

export interface CustomerPaymentInfo {
   name: string;
   email: string;
   phone: string;
}

export interface BookingPaymentDetail {
   bookingId: string;
   bookingCode: string;
   status: string;
   bookingDate: string;
   showtime: ShowtimePaymentDetail;
   seats: SeatPaymentDetail[];
   products: ProductPaymentDetail[];
   payment: PaymentTransactionInfo;
   customer: CustomerPaymentInfo;
}

export const paymentService = {
   /**
    * Create Payment (VNPAY)
    */
   createVNPayPayment: (data: PaymentSearchParams) => {
      return apiService.get<ApiResponse<any>>(`${PAYMENT_API_PATH}/vn-pay`, {
         params: data,
      });
   },

   /**
    * Lấy chi tiết thông tin thanh toán / đặt vé theo bookingId
    */
   getPaymentDetails: (bookingId: string) => {
      return apiService.get<ApiResponse<BookingPaymentDetail>>(
         `/booking/${bookingId}`,
      );
   },
};

