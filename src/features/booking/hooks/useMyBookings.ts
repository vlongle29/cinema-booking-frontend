import { useState, useEffect } from "react";
import { bookingService } from "@/services/bookingService";
import type { BookingListItem } from "@/types/booking";

export const useMyBookings = () => {
   const [bookings, setBookings] = useState<BookingListItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchBookings = async () => {
         try {
            setIsLoading(true);
            const response = await bookingService.getMyBookings();

            const paidBookings = (response.data.content || []).filter(
               (b: BookingListItem) => b.status === "PAID",
            );

            setBookings(paidBookings);
         } catch (error) {
            console.error("Failed to fetch user bookings:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookings();
   }, []);

   return { bookings, isLoading };
};
