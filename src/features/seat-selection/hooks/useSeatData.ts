import { useState, useEffect, useMemo } from "react";
import { seatService } from "@/services/seatService";
import { showtimeService } from "@/services/showtimeService";
import { useBookingWebSocket } from "@/hooks/useBookingWebSocket";
import { SEAT_STATUS } from "@/constants/websocketEvents";
import { TICKET_PRICE } from "@/constants/mockData";

export const useSeatData = (showtimeId: string | undefined) => {
   const { seatStatus: wsSeatStatus } = useBookingWebSocket(showtimeId || "");
   const [seatLayout, setSeatLayout] = useState<any[]>([]);
   const [seatStatuses, setSeatStatuses] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const loadData = async () => {
         if (!showtimeId) return;
         try {
            setIsLoading(true);
            const showtimeRes =
               await showtimeService.getShowtimeById(showtimeId);
            const roomId = showtimeRes.data.roomId;

            const [layoutRes, statusRes] = await Promise.all([
               seatService.getSeatsByRoom(roomId),
               showtimeService.getAllSeatStatus(showtimeId),
            ]);

            if (layoutRes.data) setSeatLayout(layoutRes.data);
            if (statusRes.data?.seats) setSeatStatuses(statusRes.data.seats);
         } catch (error) {
            console.error("Failed to fetch seats:", error);
         } finally {
            setIsLoading(false);
         }
      };
      loadData();
   }, [showtimeId]);

   const mergedSeats = useMemo(() => {
      return seatLayout.map((seat: any) => {
         const statusInfo = seatStatuses.find((s: any) => s.seatId === seat.id);
         const realTimeStatus = wsSeatStatus[seat.id];

         const finalStatus =
            realTimeStatus || statusInfo?.status || SEAT_STATUS.AVAILABLE;

         return {
            ...seat,
            currentStatus: finalStatus,
            currentPrice:
               statusInfo?.price || seat.seatType?.basePrice || TICKET_PRICE,
            heldByBookingId: statusInfo?.heldByBookingId,
         };
      });
   }, [seatLayout, seatStatuses, wsSeatStatus]);

   const maxCols =
      seatLayout.length > 0
         ? Math.max(...seatLayout.map((s) => s.columnIndex)) + 1
         : 10;
   const maxRows =
      seatLayout.length > 0
         ? Math.max(...seatLayout.map((s) => s.rowIndex)) + 1
         : 10;

   return { mergedSeats, maxCols, maxRows, isLoading };
};
