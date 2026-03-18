// src/hooks/useShowtimeList.ts
import { useState, useCallback, useEffect } from "react";
import { showtimeService } from "../services/showtimeService";
import type { Showtime, ApiResponse, PaginatedResponse, ShowtimeSearchParams } from "../types/showtime";

export const useShowtimeList = (isCreating: boolean) => {
   const [showtimes, setShowtimes] = useState<Showtime[]>([]);
   const [isLoadingList, setIsLoadingList] = useState(false);
   const [searchParams, setSearchParams] = useState<ShowtimeSearchParams>({
      page: 1, size: 10, sortBy: "startTime", sortDirection: "DESC",
   });
   const [pagination, setPagination] = useState({ totalPages: 1, totalElements: 0 });

   const fetchShowtimes = useCallback(async (params: ShowtimeSearchParams) => {
      setIsLoadingList(true);
      try {
         const response = await showtimeService.searchShowtimes<ApiResponse<PaginatedResponse<Showtime>>>(params);
         if (response.success) {
            setShowtimes(response.data.content);
            setPagination({
               totalPages: response.data.totalPages,
               totalElements: response.data.totalElements,
            });
         }
      } catch (error) {
         console.error("Failed to fetch showtimes", error);
      } finally {
         setIsLoadingList(false);
      }
   }, []);

   useEffect(() => {
      if (!isCreating) {
         fetchShowtimes(searchParams);
      }
   }, [isCreating, fetchShowtimes, searchParams]);

   const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xoá suất chiếu này?")) {
         try {
            await showtimeService.deleteShowtime(id);
            fetchShowtimes(searchParams);
         } catch (err) {
            alert("Lỗi khi xoá suất chiếu");
         }
      }
   };

   return {
      showtimes, isLoadingList, searchParams, setSearchParams,
      pagination, fetchShowtimes, handleDelete
   };
};