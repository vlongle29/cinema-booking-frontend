import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEAT_STATUS } from "@/constants/websocketEvents";
import { bookingService } from "@/services/bookingService";
import type { SeatStatus } from "@/types/booking";

export const useSeatSelection = (
   showtimeId: string | undefined,
   mergedSeats: any[],
) => {
   const navigate = useNavigate();
   const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

   const toggleSeat = (seat: any) => {
      if (
         [SEAT_STATUS.BOOKED, SEAT_STATUS.LOCKED, "HELD"].includes(
            seat.currentStatus,
         )
      ) {
         return;
      }
      const newSelected = new Set(selectedSeats);
      newSelected.has(seat.id)
         ? newSelected.delete(seat.id)
         : newSelected.add(seat.id);
      setSelectedSeats(newSelected);
   };

   const getSeatDisplayStatus = (seat: any): SeatStatus => {
      if (selectedSeats.has(seat.id)) return "selected";
      if (
         [SEAT_STATUS.BOOKED, SEAT_STATUS.LOCKED, "HELD"].includes(
            seat.currentStatus,
         )
      )
         return "occupied";
      return "available";
   };

   const handleCheckout = async () => {
      if (selectedSeats.size === 0) {
         alert("Vui lòng chọn ít nhất một ghế để tiếp tục.");
         return;
      }

      const seatIds = Array.from(selectedSeats);
      try {
         const response = await bookingService.confirmBooking(
            showtimeId || "",
            seatIds,
            [],
         );

         const seatNumbers = mergedSeats
            .filter((s) => selectedSeats.has(s.id))
            .map((s) => s.seatNumber);
         const totalPrice = response.data.tickets.reduce(
            (total: number, ticket: any) => total + ticket.price,
            0,
         );

         navigate("/checkout", {
            state: {
               showtimeId,
               seats: seatNumbers,
               bookingId: response.data.id,
               ticketPrice: totalPrice,
               totalAmount: totalPrice,
               products: [],
            },
         });
      } catch (error) {
         console.error("Lỗi khi tạo đơn hàng:", error);
         alert("Không thể đặt ghế lúc này. Vui lòng thử lại!");
      }
   };

   return { selectedSeats, toggleSeat, getSeatDisplayStatus, handleCheckout };
};
