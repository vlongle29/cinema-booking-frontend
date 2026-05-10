import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const PAYMENT_API_PATH = "/payments";

export interface PaymentSearchParams {
   amount?: String;
   bankCode?: String;
   bookingId?: String;
}

export const paymentService = {
   /**
    * Create Payment
    */
   createVNPayPayment: (data: PaymentSearchParams) => {
      return apiService.get<ApiResponse<any>>(`${PAYMENT_API_PATH}/vn-pay`, {
         params: data,
      });
   },
};
