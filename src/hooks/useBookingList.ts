import { useState, useCallback, useEffect } from "react";
import { bookingService, BookingListItem } from "../services/bookingService";

export const useBookingList = () => {
   const [bookings, setBookings] = useState<BookingListItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchParams, setSearchParams] = useState<any>({
      page: 1,
      size: 10,
      status: "",
      search: "",
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
            status: params.status === "ALL" ? undefined : params.status,
            search: params.search || undefined,
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
