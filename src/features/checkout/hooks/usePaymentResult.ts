import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { bookingService } from "@/services/bookingService";
import { showtimeService } from "@/services/showtimeService";

export const usePaymentResult = () => {
   const [searchParams] = useSearchParams();
   const [bookingData, setBookingData] = useState<any>(null);
   const [showtimeData, setShowtimeData] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   // Lấy các thông số từ VNPAY callback
   const responseCode = searchParams.get("vnp_ResponseCode");
   const amount = searchParams.get("vnp_Amount");
   const transactionNo = searchParams.get("vnp_TransactionNo");
   const orderInfo = searchParams.get("vnp_OrderInfo")?.toString() || "";
   const bookingId = orderInfo.split(": ")[1];

   const isSuccess = responseCode === "00";

   useEffect(() => {
      const fetchAllDetails = async () => {
         if (!isSuccess || !bookingId) {
            setLoading(false);
            return;
         }

         try {
            // B1: Lấy thông tin booking trước
            const bookingRes =
               await bookingService.getBookingDetails(bookingId);
            setBookingData(bookingRes.data);

            // B2: Sau khi có showtimeId từ booking, lấy thông tin suất chiếu
            if (bookingRes.data?.showtimeId) {
               const showtimeRes = await showtimeService.getShowtimeDetails(
                  bookingRes.data.showtimeId,
               );
               setShowtimeData(showtimeRes.data);
            }
         } catch (error) {
            console.error("Error fetching payment details:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchAllDetails();
   }, [isSuccess, bookingId]);

   return {
      isSuccess,
      loading,
      bookingData,
      showtimeData,
      transactionNo,
      bookingId,
      amount,
   };
};
