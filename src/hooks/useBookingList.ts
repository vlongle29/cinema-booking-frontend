import { useState, useCallback, useEffect } from "react";
import { bookingService } from "../services/bookingService";
import type { BookingListItem } from "@/types/booking";

export const useBookingList = () => {
   const [bookings, setBookings] = useState<BookingListItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchParams, setSearchParams] = useState<any>({
      page: 1,
      size: 10,
      status: "",
      keyword: "",
   });
   const [pagination, setPagination] = useState({
      totalPages: 0,
      totalElements: 0,
   });

   const fetchBookings = useCallback(async (params: any) => {
      setIsLoading(true);
      try {
         const requestParams = {
            ...params,
            status: params.status || "",
            keyword: params.keyword || "",
         };

         const response = await bookingService.searchBookings(requestParams);
         if (response.success && response.data) {
            setBookings(response.data.content);
            setPagination({
               totalPages: response.data.totalPages || 0,
               totalElements: response.data.totalElements || 0,
            });
         }
      } catch (error) {
         console.error("Failed to fetch bookings:", error);
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchBookings(searchParams);
   }, [fetchBookings, searchParams]);

   return {
      bookings,
      isLoading,
      searchParams,
      setSearchParams,
      pagination,
      fetchBookings,
   };
};
