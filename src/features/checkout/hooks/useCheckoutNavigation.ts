import { useEffect, useCallback } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { bookingService } from "@/services/bookingService";
import { seatHoldService } from "@/services/seatHoldService";

export const useCheckoutNavigation = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const navType = useNavigationType();

   const { showtimeId, seats, bookingId } = location.state || {};

   const handleBackToSeatSelection = useCallback(async () => {
      if (bookingId) {
         try {
            await seatHoldService.releaseSeats(bookingId);
            await bookingService.cancelBooking(
               bookingId,
               "User canceled during payment",
            );
         } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
         }
      }

      navigate(`/seat-select/${showtimeId}`, {
         state: { showtimeId, seats },
         replace: true,
      });
   }, [bookingId, navigate, showtimeId, seats]);

   useEffect(() => {
      const handleBackNavigation = async () => {
         if (navType === "POP" && bookingId) {
            await handleBackToSeatSelection();
         }
      };
      handleBackNavigation();
   }, [navType, bookingId, handleBackToSeatSelection]);

   useEffect(() => {
      window.addEventListener("popstate", handleBackToSeatSelection);
      return () => {
         window.removeEventListener("popstate", handleBackToSeatSelection);
      };
   }, [handleBackToSeatSelection]);

   return { handleBackToSeatSelection, state: location.state || {} };
};
