import { useState, useEffect, useCallback, useContext } from "react";
import apiService from "../services/apiService";
import { AuthContext } from "../context/AuthContext";
import type { Movie, Branch, Room, ShowtimeFormat, City } from "../types/showtime";


export interface ShowtimeFormData {
   movieId: string;
   cityId: string;
   branchId: string;
   roomId: string;
   date: string;          // YYYY-MM-DD — used to fetch available slots
   selectedSlots: string[]; // e.g. ["09:00", "13:30"]
   format: string;
}

export interface ApiResponseWrapper<T> {
   success: boolean;
   data: T;
   message: string;
}

export interface CreatedShowtimeItem {
   id: string;
   timeStr: string;
   startTime: string;
   endTime: string;
}

export interface RejectedShowtimeItem {
   timeStr: string;
   reason: string;
}

export interface BatchCreateShowtimeResponse {
   created: CreatedShowtimeItem[];
   rejected: RejectedShowtimeItem[];
}

const EMPTY_FORM: ShowtimeFormData = {
   movieId: "",
   cityId: "",
   branchId: "",
   roomId: "",
   date: "",
   selectedSlots: [],
   format: "",
};

export const useCreateShowtime = () => {
   const { isAuthenticated, loading: authLoading } = useContext(AuthContext) || {};

   const [formData, setFormData] = useState<ShowtimeFormData>(EMPTY_FORM);

   const [options, setOptions] = useState({
      movies: [] as Movie[],
      cities: [] as City[],
      branch: [] as Branch[],
      rooms: [] as Room[],
      formats: [] as ShowtimeFormat[],
      availableSlots: [] as string[],
   });

   const [status, setStatus] = useState({
      isLoading: false,
      isFetching: false,
      isFetchingSlots: false,
      error: null as string | null,
      success: false,
      batchResult: null as BatchCreateShowtimeResponse | null,
   });

   // ─── 1. Initial Fetch (Movies, Cities, Formats) ───────────────────────────
   useEffect(() => {
      if (authLoading || !isAuthenticated) {
         if (!authLoading)
            console.log("⏹️ [useCreateShowtime] Fetch skipped: User not authenticated.");
         return;
      }

      let isMounted = true;

      const fetchInitialData = async () => {
         console.log("🚀 [useCreateShowtime] Fetching initial data...");
         setStatus((prev) => ({ ...prev, isFetching: true, error: null }));
         try {
            const [moviesRes, citiesRes, formatsRes] = await Promise.all([
               apiService.get<ApiResponseWrapper<any>>("/movies/search"),
               apiService.get<ApiResponseWrapper<any>>("/cities"),
               apiService.get<ApiResponseWrapper<any>>("/movie-formats"),
            ]);

            if (isMounted) {
               const extractData = (res: ApiResponseWrapper<any>) =>
                  Array.isArray(res.data) ? res.data : res.data?.content || [];

               setOptions((prev) => ({
                  ...prev,
                  movies: extractData(moviesRes),
                  cities: extractData(citiesRes),
                  formats: extractData(formatsRes),
               }));
            }
         } catch (error: any) {
            if (isMounted)
               setStatus((prev) => ({
                  ...prev,
                  error: error.message || "Lỗi khi tải dữ liệu ban đầu.",
               }));
         } finally {
            if (isMounted) setStatus((prev) => ({ ...prev, isFetching: false }));
         }
      };

      fetchInitialData();
      return () => { isMounted = false; };
   }, [isAuthenticated, authLoading]);

   // ─── 2. Fetch Branches when cityId changes ────────────────────────────────
   useEffect(() => {
      if (authLoading || !isAuthenticated || !formData.cityId) {
         setOptions((prev) => ({ ...prev, branch: [] }));
         return;
      }

      let isMounted = true;

      const fetchBranch = async () => {
         setStatus((prev) => ({ ...prev, isFetching: true, error: null }));
         try {
            const branchRes = await apiService.get<ApiResponseWrapper<Branch[]>>(
               "/branch",
               { params: { cityId: formData.cityId } }
            );
            if (isMounted) {
               const branch = Array.isArray(branchRes.data)
                  ? branchRes.data
                  : (branchRes.data as any)?.content || [];
               setOptions((prev) => ({ ...prev, branch }));
            }
         } catch (error: any) {
            if (isMounted)
               setStatus((prev) => ({
                  ...prev,
                  error: error.message || "Lỗi khi tải danh sách chi nhánh.",
               }));
         } finally {
            if (isMounted) setStatus((prev) => ({ ...prev, isFetching: false }));
         }
      };

      fetchBranch();
      return () => { isMounted = false; };
   }, [formData.cityId, isAuthenticated, authLoading]);

   // ─── 3. Fetch Rooms when branchId changes ────────────────────────────────
   useEffect(() => {
      if (authLoading || !isAuthenticated || !formData.branchId) {
         setOptions((prev) => ({ ...prev, rooms: [] }));
         return;
      }

      let isMounted = true;

      const fetchRooms = async () => {
         setStatus((prev) => ({ ...prev, isFetching: true, error: null }));
         try {
            const roomsRes = await apiService.get<ApiResponseWrapper<Room[]>>(
               "/room/search",
               { params: { branchId: formData.branchId, isDeleted: false } }
            );
            if (isMounted) {
               const rooms = Array.isArray(roomsRes.data)
                  ? roomsRes.data
                  : (roomsRes.data as any)?.content || [];
               setOptions((prev) => ({ ...prev, rooms }));
            }
         } catch (error: any) {
            if (isMounted)
               setStatus((prev) => ({
                  ...prev,
                  error: error.message || "Lỗi khi tải danh sách phòng chiếu.",
               }));
         } finally {
            if (isMounted) setStatus((prev) => ({ ...prev, isFetching: false }));
         }
      };

      fetchRooms();
      return () => { isMounted = false; };
   }, [formData.branchId, isAuthenticated, authLoading]);

   // ─── 4. Fetch Available Time Slots when roomId + movieId + date are set ──
   useEffect(() => {
      if (!formData.roomId || !formData.movieId || !formData.date) {
         setOptions((prev) => ({ ...prev, availableSlots: [] }));
         setFormData((prev) => ({ ...prev, selectedSlots: [] }));
         return;
      }

      let isMounted = true;

      const fetchSlots = async () => {
         console.log("🕐 [useCreateShowtime] Fetching available time slots...");
         setStatus((prev) => ({ ...prev, isFetchingSlots: true, error: null }));
         // Reset previously selected slots whenever deps change
         setFormData((prev) => ({ ...prev, selectedSlots: [] }));

         try {
            const res = await apiService.get<ApiResponseWrapper<string[]>>(
               `/room/${formData.roomId}/available-slots`,
               { params: { movieId: formData.movieId, date: formData.date } }
            );
            if (isMounted) {
               const slots = Array.isArray(res.data) ? res.data : [];
               setOptions((prev) => ({ ...prev, availableSlots: slots }));
            }
         } catch (error: any) {
            if (isMounted) {
               setOptions((prev) => ({ ...prev, availableSlots: [] }));
               setStatus((prev) => ({
                  ...prev,
                  error: error.message || "Lỗi khi tải danh sách time slot.",
               }));
            }
         } finally {
            if (isMounted) setStatus((prev) => ({ ...prev, isFetchingSlots: false }));
         }
      };

      fetchSlots();
      return () => { isMounted = false; };
   }, [formData.roomId, formData.movieId, formData.date]);

   // ─── 5. Generic Field Update with Cascade Reset ───────────────────────────
   const updateField = useCallback(
      (field: keyof ShowtimeFormData, value: string | string[]) => {
         setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            if (field === "cityId") {
               newData.branchId = "";
               newData.roomId = "";
               newData.date = "";
               newData.selectedSlots = [];
            } else if (field === "branchId") {
               newData.roomId = "";
               newData.date = "";
               newData.selectedSlots = [];
            } else if (field === "roomId" || field === "movieId" || field === "date") {
               newData.selectedSlots = [];
            }

            return newData;
         });

         if (field === "cityId") {
            setOptions((prev) => ({ ...prev, rooms: [], availableSlots: [] }));
         }
      },
      []
   );

   // Toggle a single slot on/off
   const toggleSlot = useCallback((slot: string) => {
      setFormData((prev) => {
         const exists = prev.selectedSlots.includes(slot);
         return {
            ...prev,
            selectedSlots: exists
               ? prev.selectedSlots.filter((s) => s !== slot)
               : [...prev.selectedSlots, slot],
         };
      });
   }, []);

   // ─── 6. Submit — Calls batch endpoint /showtimes/batch ────────────────────
   const submitForm = async () => {
      setStatus((prev) => ({ ...prev, isLoading: true, error: null, success: false, batchResult: null }));

      const { movieId, roomId, date, selectedSlots, format } = formData;

      if (!movieId || !roomId || !date || selectedSlots.length === 0 || !format) {
         setStatus((prev) => ({
            ...prev,
            isLoading: false,
            error: "Vui lòng điền đầy đủ thông tin và chọn ít nhất một time slot.",
         }));
         return;
      }

      try {
         const payload = {
            movieId,
            roomId,
            date,
            times: selectedSlots,
            format,
         };

         const response = await apiService.post<ApiResponseWrapper<BatchCreateShowtimeResponse>>(
            "/showtimes/batch",
            payload
         );

         const batchData = response.data;

         setStatus((prev) => ({ 
            ...prev, 
            isLoading: false, 
            success: batchData.created.length > 0,
            batchResult: batchData 
         }));

         // If all were created successfully, reset form. 
         // If some were rejected, maybe keep form but update available slots?
         // For now, let's reset if any were created.
         if (batchData.created.length > 0) {
            setFormData(EMPTY_FORM);
            setOptions((prev) => ({ ...prev, availableSlots: [] }));
         }
      } catch (error: any) {
         setStatus((prev) => ({
            ...prev,
            isLoading: false,
            error: error.message || "Đã xảy ra lỗi khi tạo suất chiếu hàng loạt.",
         }));
      }
   };

   return {
      formData,
      updateField,
      toggleSlot,
      submitForm,
      options,
      status,
   };
};
