import React, { useState, useEffect } from "react";
import {
   Film,
   MapPin,
   Monitor,
   Calendar,
   Clock,
   Loader2,
   CheckCircle,
   AlertTriangle,
   DollarSign,
   Activity,
} from "lucide-react";
import type {
   Movie,
   Branch,
   Room,
   ShowtimeFormat,
   City,
   Showtime,
} from "@/features/showtime/types/showtime.types";
import apiService from "@/services/apiService";
import { showtimeService } from "@/services/showtimeService";

interface EditShowtimeFormProps {
   showtime: any;
   onCancel: () => void;
   onSuccess: () => void;
}

interface ApiResponseWrapper<T> {
   success: boolean;
   data: T;
   message: string;
}

const formatToLocalInputValue = (dateTimeStr: string): string => {
   if (!dateTimeStr) return "";
   try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
   } catch {
      return "";
   }
};

export default function EditShowtimeForm({
   showtime,
   onCancel,
   onSuccess,
}: EditShowtimeFormProps) {
   const [formData, setFormData] = useState({
      movieId: showtime?.movieId || "",
      cityId: showtime?.branch?.cityId || "",
      branchId: showtime?.branchId || "",
      roomId: showtime?.roomId || "",
      startTime: formatToLocalInputValue(showtime?.startTime || ""),
      endTime: formatToLocalInputValue(showtime?.endTime || ""),
      price: showtime?.price || 0,
      format: showtime?.format || "",
      status: showtime?.status || "OPEN",
   });

   const [options, setOptions] = useState({
      movies: [] as Movie[],
      cities: [] as City[],
      branch: [] as Branch[],
      rooms: [] as Room[],
      formats: [] as ShowtimeFormat[],
   });

   const [status, setStatus] = useState({
      isLoading: false,
      isFetching: false,
      error: null as string | null,
      success: false,
   });

   // ─── 1. Fetch Initial Options ──────────────────────────────────────────
   useEffect(() => {
      let isMounted = true;

      const fetchInitialData = async () => {
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

               const movieOpts = extractData(moviesRes);
               const cityOpts = extractData(citiesRes);
               const formatOpts = extractData(formatsRes);

               setOptions((prev) => ({
                  ...prev,
                  movies: movieOpts,
                  cities: cityOpts,
                  formats: formatOpts,
               }));

               // Tải trước Branches của City hiện tại
               const currentCityId = showtime.branch?.cityId;
               if (currentCityId) {
                  const branchRes = await apiService.get<
                     ApiResponseWrapper<Branch[]>
                  >("/branch", { params: { cityId: currentCityId } });
                  
                  const branchOpts = Array.isArray(branchRes.data)
                     ? branchRes.data
                     : (branchRes.data as any)?.content || [];

                  setOptions((prev) => ({ ...prev, branch: branchOpts }));
               }

               // Tải trước Rooms của Branch hiện tại
               const currentBranchId = showtime.branchId;
               if (currentBranchId) {
                  const roomsRes = await apiService.get<ApiResponseWrapper<Room[]>>(
                     "/room/search",
                     { params: { branchId: currentBranchId, isDeleted: false } },
                  );

                  const roomOpts = Array.isArray(roomsRes.data)
                     ? roomsRes.data
                     : (roomsRes.data as any)?.content || [];

                  setOptions((prev) => ({ ...prev, rooms: roomOpts }));
               }
            }
         } catch (error: any) {
            if (isMounted) {
               setStatus((prev) => ({
                  ...prev,
                  error: error.message || "Lỗi khi tải dữ liệu ban đầu.",
               }));
            }
         } finally {
            if (isMounted) {
               setStatus((prev) => ({ ...prev, isFetching: false }));
            }
         }
      };

      fetchInitialData();
      return () => {
         isMounted = false;
      };
   }, [showtime]);

   // ─── 2. Fetch Branches when cityId changes ────────────────────────────────
   useEffect(() => {
      if (!formData.cityId || status.isFetching) return;

      let isMounted = true;
      const fetchBranches = async () => {
         try {
            const branchRes = await apiService.get<
               ApiResponseWrapper<Branch[]>
            >("/branch", { params: { cityId: formData.cityId } });
            
            if (isMounted) {
               const branchOpts = Array.isArray(branchRes.data)
                  ? branchRes.data
                  : (branchRes.data as any)?.content || [];
               setOptions((prev) => ({ ...prev, branch: branchOpts }));
            }
         } catch (error: any) {
            console.error("Lỗi khi tải danh sách chi nhánh:", error);
         }
      };

      fetchBranches();
      return () => {
         isMounted = false;
      };
   }, [formData.cityId]);

   // ─── 3. Fetch Rooms when branchId changes ─────────────────────────────────
   useEffect(() => {
      if (!formData.branchId || status.isFetching) return;

      let isMounted = true;
      const fetchRooms = async () => {
         try {
            const roomsRes = await apiService.get<ApiResponseWrapper<Room[]>>(
               "/room/search",
               { params: { branchId: formData.branchId, isDeleted: false } },
            );
            if (isMounted) {
               const roomOpts = Array.isArray(roomsRes.data)
                  ? roomsRes.data
                  : (roomsRes.data as any)?.content || [];
               setOptions((prev) => ({ ...prev, rooms: roomOpts }));
            }
         } catch (error: any) {
            console.error("Lỗi khi tải danh sách phòng chiếu:", error);
         }
      };

      fetchRooms();
      return () => {
         isMounted = false;
      };
   }, [formData.branchId]);

   // ─── 4. Input Handlers ──────────────────────────────────────────────────
   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => {
         const updated = { ...prev, [name]: value };

         // Reset cascade
         if (name === "cityId") {
            updated.branchId = "";
            updated.roomId = "";
         } else if (name === "branchId") {
            updated.roomId = "";
         }

         return updated;
      });

      if (name === "cityId") {
         setOptions((prev) => ({ ...prev, rooms: [] }));
      }
   };

   // ─── 5. Submit ─────────────────────────────────────────────────────────
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.price <= 0) {
         setStatus((prev) => ({
            ...prev,
            error: "Giá vé phải lớn hơn 0.",
         }));
         return;
      }

      setStatus((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
         // Chuyển đổi định dạng LocalDateTime tương ứng yêu cầu backend
         // datetime-local lưu kiểu YYYY-MM-DDTHH:mm
         // Backend mong đợi LocalDateTime (YYYY-MM-DDTHH:mm:ss hoặc YYYY-MM-DDTHH:mm)
         const payload = {
            movieId: formData.movieId,
            roomId: formData.roomId,
            startTime: formData.startTime ? `${formData.startTime}:00` : null,
            price: Number(formData.price),
            format: formData.format,
            status: formData.status,
         };

         const response = await showtimeService.updateShowtime(showtime.id, payload);

         if (response.success) {
            setStatus((prev) => ({ ...prev, isLoading: false, success: true }));
            setTimeout(() => {
               onSuccess();
            }, 1000);
         } else {
            setStatus((prev) => ({
               ...prev,
               isLoading: false,
               error: response.message || "Không thể cập nhật suất chiếu.",
            }));
         }
      } catch (error: any) {
         setStatus((prev) => ({
            ...prev,
            isLoading: false,
            error: error.message || "Đã xảy ra lỗi khi cập nhật suất chiếu.",
         }));
      }
   };

   return (
      <div className="space-y-6">
         {status.success && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-[6px] text-emerald-400 text-sm font-medium">
               <CheckCircle className="w-4 h-4 flex-shrink-0" />
               <span>Cập nhật suất chiếu thành công!</span>
            </div>
         )}

         {status.error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-[6px] text-red-400 text-sm font-medium">
               <AlertTriangle className="w-4 h-4 flex-shrink-0" />
               <span>{status.error}</span>
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Format */}
               <div className="space-y-2">
                  <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                     <Monitor className="w-3.5 h-3.5 text-[#f84565]" /> Format *
                  </label>
                  <select
                     name="format"
                     value={formData.format}
                     onChange={handleInputChange}
                     required
                     className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                     disabled={status.isFetching}
                  >
                     <option value="">Select a format</option>
                     {options.formats.map((fmt: ShowtimeFormat) => (
                        <option key={fmt.format} value={fmt.format}>
                           {fmt.displayName}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Room */}
               <div className="space-y-2">
                  <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                     <Monitor className="w-3.5 h-3.5 text-[#f84565]" /> Room *
                  </label>
                  <select
                     name="roomId"
                     value={formData.roomId}
                     onChange={handleInputChange}
                     required
                     className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                     disabled={!formData.branchId || status.isFetching}
                  >
                     <option value="">Select a room</option>
                     {options.rooms.map((r: Room) => (
                        <option key={r.id} value={r.id}>
                           {r.name}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Price */}
               <div className="space-y-2">
                  <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                     <DollarSign className="w-3.5 h-3.5 text-[#f84565]" /> Price (VND) *
                  </label>
                  <input
                     type="number"
                     name="price"
                     value={formData.price}
                     onChange={handleInputChange}
                     required
                     min="1000"
                     step="1000"
                     className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                     placeholder="e.g. 80000"
                     disabled={status.isFetching}
                  />
               </div>

               {/* Start Time */}
               <div className="space-y-2">
                  <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                     <Calendar className="w-3.5 h-3.5 text-[#f84565]" /> Start Time *
                  </label>
                  <input
                     type="datetime-local"
                     name="startTime"
                     value={formData.startTime}
                     onChange={handleInputChange}
                     required
                     className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565] [color-scheme:dark]"
                     disabled={status.isFetching}
                  />
               </div>


               {/* Status */}
               <div className="space-y-2">
                  <label className="text-[#d1d5dc] text-xs font-medium flex items-center gap-2">
                     <Activity className="w-3.5 h-3.5 text-[#f84565]" /> Status *
                  </label>
                  <select
                     name="status"
                     value={formData.status}
                     onChange={handleInputChange}
                     required
                     className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]"
                     disabled={status.isFetching}
                  >
                     <option value="OPEN">OPEN</option>
                     <option value="CLOSED">CLOSED</option>
                  </select>
               </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#393939]">
               <button
                  type="submit"
                  disabled={status.isLoading || status.isFetching}
                  className="px-5 py-2 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-[6px] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
               >
                  {status.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {status.isLoading ? "Đang lưu..." : "Cập nhật suất chiếu"}
               </button>
               <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2 bg-[#1a1a1e] hover:bg-[#252529] text-[#d1d5dc] font-semibold border border-[#393939] rounded-[6px] transition-colors text-sm"
               >
                  Hủy
               </button>
            </div>
         </form>
      </div>
   );
}
