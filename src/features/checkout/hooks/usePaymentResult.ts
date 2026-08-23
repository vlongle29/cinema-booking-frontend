import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { paymentService, type BookingPaymentDetail } from "@/services/paymentService";

export const usePaymentResult = () => {
   const [searchParams] = useSearchParams();
   const [bookingData, setBookingData] = useState<BookingPaymentDetail | null>(null);
   const [loading, setLoading] = useState(true);

   // Lấy các thông số từ VNPAY callback hoặc URL query
   const responseCode = searchParams.get("vnp_ResponseCode");
   const amount = searchParams.get("vnp_Amount");
   const transactionNo = searchParams.get("vnp_TransactionNo");
   const orderInfo = searchParams.get("vnp_OrderInfo")?.toString() || "";
   const paramBookingId = searchParams.get("bookingId");

   // Trích xuất bookingId từ param hoặc vnp_OrderInfo
   let bookingId = paramBookingId || "";
   if (!bookingId && orderInfo) {
      // Tìm chuỗi UUID dạng xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx hoặc lấy sau dấu hai chấm
      const uuidMatch = orderInfo.match(/[a-f0-9-]{36}/i);
      if (uuidMatch) {
         bookingId = uuidMatch[0];
      } else if (orderInfo.includes(":")) {
         const parts = orderInfo.split(":");
         bookingId = parts[parts.length - 1].trim();
      } else {
         bookingId = orderInfo.trim();
      }
   }

   const isSuccess = responseCode ? responseCode === "00" : true;

   useEffect(() => {
      const fetchDetails = async () => {
         if (!isSuccess || !bookingId) {
            setLoading(false);
            return;
         }

         try {
            const response = await paymentService.getPaymentDetails(bookingId);
            if (response.data) {
               setBookingData(response.data);
            }
         } catch (error) {
            console.error("Error fetching payment details:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchDetails();
   }, [isSuccess, bookingId]);

   return {
      isSuccess: isSuccess && (!bookingData || bookingData.status === "PAID" || bookingData.status === "PENDING" || bookingData.status === "CONFIRMED"),
      loading,
      bookingData,
      transactionNo: transactionNo || bookingData?.payment?.transactionCode || null,
      bookingId: bookingId || bookingData?.bookingId || "",
      amount: amount || (bookingData?.payment?.finalAmount ? String(bookingData.payment.finalAmount) : null),
   };
};
