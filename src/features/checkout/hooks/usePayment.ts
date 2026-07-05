import { useState } from "react";
import { paymentService } from "@/services/paymentService";
import { bookingService } from "@/services/bookingService";

export const usePayment = (
   bookingId: string | undefined,
   totalAmount: number,
) => {
   const [isProcessing, setIsProcessing] = useState(false);

   const handlePayment = async (paymentMethod: string) => {
      if (!bookingId || isProcessing) {
         alert("Phiên đặt vé đã hết hạn hoặc không hợp lệ.");
         return;
      }

      setIsProcessing(true);
      try {
         let backendPaymentMethod = "E_WALLET";
         if (paymentMethod === "international" || paymentMethod === "atm") {
            backendPaymentMethod = "CREDIT_CARD";
         }

         await bookingService.checkoutBooking(bookingId, backendPaymentMethod);

         if (["vnpay", "international", "atm"].includes(paymentMethod)) {
            const bankCode = paymentMethod === "vnpay" ? " " : " ";
            const vnpAmount = (totalAmount * 100).toString();

            const response = await paymentService.createVNPayPayment({
               amount: vnpAmount,
               bankCode,
               bookingId,
            });

            const paymentUrl = response.data.paymentUrl;
            if (paymentUrl && paymentUrl.startsWith("http")) {
               window.location.href = paymentUrl;
            } else {
               alert("Không nhận được URL thanh toán.");
            }
         } else {
            alert(`Tính năng đang phát triển, vui lòng chọn VNPAY để test.`);
         }
      } catch (error) {
         console.error("Payment Error:", error);
         alert("Lỗi kết nối thanh toán!");
      } finally {
         setIsProcessing(false);
      }
   };

   return { isProcessing, handlePayment };
};
