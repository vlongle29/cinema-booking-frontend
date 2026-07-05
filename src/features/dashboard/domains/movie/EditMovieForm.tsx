import React, { useState, useEffect } from "react";
import { movieService } from "@/services/movieService";
import { genreService } from "@/services/genreService";
import { cn } from "@/utils/utils";
import { Save, X, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import type { Movie } from "@/types/movie";
import { API_BASE_URL } from "@/constants/api";

interface EditMovieFormProps {
   movie: Movie;
   onCancel: () => void;
   onSuccess: () => void;
}

interface Genre {
   id: string; // UUID
   name: string;
}

// Hàm format date an toàn để binding vào input type="date" (YYYY-MM-DD)
const formatToLocalDateString = (dateVal: any): string => {
   if (!dateVal) return "";
   try {
      // Xử lý trường hợp backend trả về mảng [YYYY, MM, DD]
      if (Array.isArray(dateVal)) {
         const [year, month, day] = dateVal;
         return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
   } catch {
      return "";
   }
};

// Hàm nối thêm domain nếu backend trả về đường dẫn tương đối
   const getFullUrl = (path?: string): string => {
      if (!path) return "";
      
      // Nếu path đã là URL hoàn chỉnh (do user nhập link ngoài) thì giữ nguyên
      if (path.startsWith("http://") || path.startsWith("https://")) {
         return path;
      }
   
      // Nếu là path tương đối từ backend, gắn thêm domain vào
      // Bạn có thể thay http://localhost:8080 bằng biến môi trường (ví dụ: import.meta.env.VITE_API_URL)
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${API_BASE_URL}${cleanPath}`;
   };

export default function EditMovieForm({ movie, onCancel, onSuccess }: EditMovieFormProps) {
   const [formData, setFormData] = useState({
      title: movie?.title || "",
      description: movie?.description || "",
      director: movie?.director || "",
      cast: movie?.cast || "",
      durationMinutes: movie?.durationMinutes || 0,
      releaseDate: formatToLocalDateString(movie?.releaseDate),
      posterUrl: getFullUrl(movie?.posterUrl) || "",
      trailerUrl: movie?.trailerUrl || "",
      language: movie?.language || "",
      rated: movie?.rated || "",
      status: movie?.status || "COMING_SOON",
      genreIds: movie?.genres?.map((g) => g.id) || [],
   });

   const [posterFile, setPosterFile] = useState<File | null>(null);
   const [genres, setGenres] = useState<Genre[]>([]);
   
   const [status, setStatus] = useState({
      isLoading: false,
      isFetchingGenres: false,
      error: null as string | null,
      success: false,
   });

   // Fetch genres
   useEffect(() => {
      let isMounted = true;
      const fetchGenres = async () => {
         setStatus((prev) => ({ ...prev, isFetchingGenres: true }));
         try {
            const response: any = await genreService.searchGenres({ size: 100 });
            if (isMounted) {
               setGenres(response.data?.content || []);
            }
         } catch (err) {
            console.error("Failed to fetch genres:", err);
            if (isMounted) {
               setStatus((prev) => ({ ...prev, error: "Không thể tải danh sách thể loại." }));
            }
         } finally {
            if (isMounted) {
               setStatus((prev) => ({ ...prev, isFetchingGenres: false }));
            }
         }
      };
      fetchGenres();
      return () => {
         isMounted = false;
      };
   }, []);
   
   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
   ) => {
      const { name, value, type } = e.target;
      
      // Handle Multi-select Checkbox cho Thể loại
      if (name === "genreIds") {
         const checked = (e.target as HTMLInputElement).checked;
         setFormData((prev) => {
            const currentGenreIds = prev.genreIds;
            if (checked) {
               return { ...prev, genreIds: [...currentGenreIds, value] };
            } else {
               return {
                  ...prev,
                  genreIds: currentGenreIds.filter((id) => id !== value),
               };
            }
         });
      } else {
         // Handle các input thông thường
         setFormData((prev) => ({
            ...prev,
            [name]: type === "number" && value !== "" ? parseInt(value, 10) : value,
         }));
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setPosterFile(e.target.files[0]);
      } else {
         setPosterFile(null);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.genreIds.length === 0) {
         setStatus((prev) => ({ ...prev, error: "Vui lòng chọn ít nhất một thể loại." }));
         return;
      }

      setStatus((prev) => ({ ...prev, isLoading: true, error: null }));

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("director", formData.director);
      data.append("cast", formData.cast);
      data.append("durationMinutes", formData.durationMinutes.toString());
      data.append("releaseDate", formData.releaseDate);
      data.append("trailerUrl", formData.trailerUrl);
      data.append("language", formData.language);
      data.append("rated", formData.rated);
      data.append("status", formData.status);

      formData.genreIds.forEach((id) => data.append("genreIds", id));

      const cleanPosterUrl = formData.posterUrl.replace(API_BASE_URL, "");

      if (posterFile) {
         data.append("posterFile", posterFile);
      } else if (formData.posterUrl) {
         data.append("posterUrl", cleanPosterUrl);
      }

      try {
         await movieService.updateMovie(movie.id, data);
         
         setStatus((prev) => ({ ...prev, isLoading: false, success: true }));
         setTimeout(() => {
            onSuccess();
         }, 1000);
      } catch (err: any) {
         setStatus((prev) => ({
            ...prev,
            isLoading: false,
            error: err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật phim.",
         }));
      }
   };

   return (
      <div className="space-y-6">
         {/* Thông báo thành công */}
         {status.success && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-[6px] text-emerald-400 text-sm font-medium">
               <CheckCircle className="w-4 h-4 flex-shrink-0" />
               <span>Cập nhật phim thành công!</span>
            </div>
         )}

         {/* Thông báo lỗi */}
         {status.error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-[6px] text-red-400 text-sm font-medium">
               <AlertTriangle className="w-4 h-4 flex-shrink-0" />
               <span>{status.error}</span>
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Title */}
               <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                     Tên phim *
                  </label>
                  <input
                     type="text"
                     id="title"
                     name="title"
                     value={formData.title}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     required
                     disabled={status.isLoading}
                  />
               </div>

               {/* Director */}
               <div>
                  <label htmlFor="director" className="block text-sm font-medium text-gray-300 mb-1">
                     Đạo diễn
                  </label>
                  <input
                     type="text"
                     id="director"
                     name="director"
                     value={formData.director}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     disabled={status.isLoading}
                  />
               </div>

               {/* Cast */}
               <div>
                  <label htmlFor="cast" className="block text-sm font-medium text-gray-300 mb-1">
                     Diễn viên
                  </label>
                  <input
                     type="text"
                     id="cast"
                     name="cast"
                     value={formData.cast}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     disabled={status.isLoading}
                  />
               </div>

               {/* Duration Minutes */}
               <div>
                  <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-300 mb-1">
                     Thời lượng (phút) *
                  </label>
                  <input
                     type="number"
                     id="durationMinutes"
                     name="durationMinutes"
                     value={formData.durationMinutes}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     required
                     min="1"
                     disabled={status.isLoading}
                  />
               </div>

               {/* Release Date */}
               <div>
                  <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-300 mb-1">
                     Ngày phát hành *
                  </label>
                  <input
                     type="date"
                     id="releaseDate"
                     name="releaseDate"
                     value={formData.releaseDate}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500 [color-scheme:dark]"
                     required
                     disabled={status.isLoading}
                  />
               </div>

               {/* Trailer URL */}
               <div>
                  <label htmlFor="trailerUrl" className="block text-sm font-medium text-gray-300 mb-1">
                     Trailer (URL)
                  </label>
                  <input
                     type="url"
                     id="trailerUrl"
                     name="trailerUrl"
                     value={formData.trailerUrl}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     disabled={status.isLoading}
                  />
               </div>

               {/* Language */}
               <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">
                     Ngôn ngữ
                  </label>
                  <input
                     type="text"
                     id="language"
                     name="language"
                     value={formData.language}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     disabled={status.isLoading}
                  />
               </div>

               {/* Rated */}
               <div>
                  <label htmlFor="rated" className="block text-sm font-medium text-gray-300 mb-1">
                     Phân loại *
                  </label>
                  <select
                     id="rated"
                     name="rated"
                     value={formData.rated}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     required
                     disabled={status.isLoading}
                  >
                     <option value="">Chọn phân loại</option>
                     <option value="P">P - Phổ biến (Mọi lứa tuổi)</option>
                     <option value="K">K - Trẻ em dưới 13 tuổi có cha mẹ đi cùng</option>
                     <option value="T13">T13 - Từ 13 tuổi trở lên</option>
                     <option value="T16">T16 - Từ 16 tuổi trở lên</option>
                     <option value="T18">T18 - Từ 18 tuổi trở lên</option>
                     <option value="C">C - Cấm chiếu</option>
                  </select>
               </div>

               {/* Status */}
               <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                     Trạng thái *
                  </label>
                  <select
                     id="status"
                     name="status"
                     value={formData.status}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     required
                     disabled={status.isLoading}
                  >
                     <option value="COMING_SOON">Coming Soon</option>
                     <option value="SHOWING">Now Showing</option>
                  </select>
               </div>

               {/* Poster Upload/URL */}
               <div className="space-y-4">
                  <div>
                     <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-300 mb-1">
                        Ảnh (URL)
                     </label>
                     <input
                        type="url"
                        id="posterUrl"
                        name="posterUrl"
                        value={formData.posterUrl}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500 disabled:opacity-50"
                        disabled={!!posterFile || status.isLoading}
                     />
                  </div>
                  <div>
                     <label htmlFor="posterFile" className="block text-sm font-medium text-gray-300 mb-1">
                        Hoặc tải ảnh mới lên
                     </label>
                     <input
                        type="file"
                        id="posterFile"
                        name="posterFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600 disabled:opacity-50"
                        disabled={status.isLoading}
                     />
                     {posterFile && (
                        <p className="text-xs text-gray-400 mt-1">Đã chọn: {posterFile.name}</p>
                     )}
                  </div>
               </div>
            </div>

            {/* Description */}
            <div>
               <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Mô tả
               </label>
               <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                  disabled={status.isLoading}
               />
            </div>

            {/* Genres */}
            <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">Thể loại *</label>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {status.isFetchingGenres ? (
                     <p className="text-gray-400 text-sm col-span-full">Đang tải thể loại...</p>
                  ) : genres.length > 0 ? (
                     genres.map((genre) => (
                        <label key={genre.id} className="flex items-center text-sm text-gray-300 cursor-pointer">
                           <input
                              type="checkbox"
                              name="genreIds"
                              value={genre.id}
                              checked={formData.genreIds.includes(genre.id)}
                              onChange={handleChange}
                              disabled={status.isLoading}
                              className="h-4 w-4 text-rose-600 bg-gray-800 border-gray-600 rounded focus:ring-rose-500"
                           />
                           <span className="ml-2">{genre.name}</span>
                        </label>
                     ))
                  ) : (
                     <p className="text-gray-400 text-sm col-span-full">Không có thể loại nào.</p>
                  )}
               </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-800">
               <button
                  type="button"
                  onClick={onCancel}
                  disabled={status.isLoading}
                  className="flex items-center gap-1 px-4 py-2 bg-[#1a1a1d] hover:bg-[#252529] text-[#d1d5dc] font-semibold border border-[#393939] rounded-md transition-colors text-sm disabled:opacity-50"
               >
                  <X className="w-4 h-4" /> Hủy
               </button>
               <button
                  type="submit"
                  disabled={status.isLoading || formData.genreIds.length === 0}
                  className={cn(
                     "flex items-center gap-2 px-5 py-2 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-md transition-colors text-sm",
                     (status.isLoading || formData.genreIds.length === 0) && "opacity-70 cursor-not-allowed"
                  )}
               >
                  {status.isLoading ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                     <Save className="w-4 h-4" />
                  )}
                  {status.isLoading ? "Đang lưu..." : "Cập nhật phim"}
               </button>
            </div>
         </form>
      </div>
   );
}