import React, { useState, useEffect } from "react";
import { movieService } from "../../../services/movieService"; // Assuming this service exists
import { genreService } from "../../../services/genreService"; // Assuming a genre service to fetch genres
import { cn } from "../../../lib/utils"; // For styling
import { Plus, X } from "lucide-react"; // Icons

interface MovieFormProps {
   onCancel: () => void;
   onSuccess: () => void;
}

interface Genre {
   id: string; // UUID
   name: string;
}

const MovieForm: React.FC<MovieFormProps> = ({ onCancel, onSuccess }) => {
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      director: "",
      cast: "",
      durationMinutes: 0,
      releaseDate: "", // YYYY-MM-DD format
      posterUrl: "",
      trailerUrl: "",
      language: "",
      rated: "",
      status: "COMING_SOON", // Default status, ensure it matches backend enum string
      genreIds: [] as string[], // Array of UUID strings
   });
   const [posterFile, setPosterFile] = useState<File | null>(null);
   const [genres, setGenres] = useState<Genre[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      // Fetch genres for the multi-select dropdown
      const fetchGenres = async () => {
         try {
            // Cập nhật để dùng searchGenres khớp với genreService.ts
            // Backend trả về Page object nên chúng ta lấy content
            const response: any = await genreService.searchGenres({
               size: 100,
            });
            setGenres(response.data.content || []);
         } catch (err) {
            console.error("Failed to fetch genres:", err);
            setError("Failed to load genres.");
         }
      };
      fetchGenres();
   }, []);

   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
   ) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      if (name === "genreIds") {
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
         setFormData((prev) => ({
            ...prev,
            [name]:
               type === "number" && value !== "" ? parseInt(value, 10) : value,
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
      setLoading(true);
      setError(null);

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

      // Append each genreId individually for List<UUID>
      formData.genreIds.forEach((id) => data.append("genreIds", id));

      // Handle poster file or URL based on user input
      if (posterFile) {
         data.append("posterFile", posterFile);
      } else if (formData.posterUrl) {
         data.append("posterUrl", formData.posterUrl);
      }

      try {
         // Assuming movieService.createMovie expects FormData
         await movieService.createMovie(data);
         onSuccess();
      } catch (err: any) {
         console.error("Error creating movie:", err);
         setError(err.response?.data?.message || "Failed to create movie.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-[8px] p-8 min-h-[500px]">
         <h2 className="text-xl font-semibold text-white mb-6">
            Create New Movie
         </h2>
         {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">
               {error}
            </div>
         )}
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Title */}
               <div>
                  <label
                     htmlFor="title"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Title
                  </label>
                  <input
                     type="text"
                     id="title"
                     name="title"
                     value={formData.title}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     required
                  />
               </div>
               {/* Director */}
               <div>
                  <label
                     htmlFor="director"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Director
                  </label>
                  <input
                     type="text"
                     id="director"
                     name="director"
                     value={formData.director}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                  />
               </div>
               {/* Cast */}
               <div>
                  <label
                     htmlFor="cast"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Cast
                  </label>
                  <input
                     type="text"
                     id="cast"
                     name="cast"
                     value={formData.cast}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                  />
               </div>
               {/* Duration Minutes */}
               <div>
                  <label
                     htmlFor="durationMinutes"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Duration (minutes)
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
                  />
               </div>
               {/* Release Date */}
               <div>
                  <label
                     htmlFor="releaseDate"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Release Date
                  </label>
                  <input
                     type="date"
                     id="releaseDate"
                     name="releaseDate"
                     value={formData.releaseDate}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                  />
               </div>
               {/* Trailer URL */}
               <div>
                  <label
                     htmlFor="trailerUrl"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Trailer URL
                  </label>
                  <input
                     type="url"
                     id="trailerUrl"
                     name="trailerUrl"
                     value={formData.trailerUrl}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                  />
               </div>
               {/* Language */}
               <div>
                  <label
                     htmlFor="language"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Language
                  </label>
                  <input
                     type="text"
                     id="language"
                     name="language"
                     value={formData.language}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                  />
               </div>
               {/* Rated */}
               <div>
                  <label
                     htmlFor="rated"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Rated (Phân loại phim)
                  </label>
                  <select
                     id="rated"
                     name="rated"
                     value={formData.rated}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     required
                  >
                     <option value="">Chọn phân loại</option>
                     <option value="P">P - Phổ biến (Mọi lứa tuổi)</option>
                     <option value="K">
                        K - Trẻ em dưới 13 tuổi có cha mẹ đi cùng
                     </option>
                     <option value="T13">T13 - Từ 13 tuổi trở lên</option>
                     <option value="T16">T16 - Từ 16 tuổi trở lên</option>
                     <option value="T18">T18 - Từ 18 tuổi trở lên</option>
                     <option value="C">C - Cấm chiếu</option>
                  </select>
               </div>
               {/* Status */}
               <div>
                  <label
                     htmlFor="status"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Status
                  </label>
                  <select
                     id="status"
                     name="status"
                     value={formData.status}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     required
                  >
                     <option value="COMING_SOON">Coming Soon</option>
                     <option value="SHOWING">Now Showing</option>
                  </select>
               </div>
               {/* Poster URL (alternative to file upload) */}
               <div>
                  <label
                     htmlFor="posterUrl"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Poster URL (Optional)
                  </label>
                  <input
                     type="url"
                     id="posterUrl"
                     name="posterUrl"
                     value={formData.posterUrl}
                     onChange={handleChange}
                     className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
                     disabled={!!posterFile} // Disable if file is selected
                  />
               </div>
               {/* Poster File Upload */}
               <div>
                  <label
                     htmlFor="posterFile"
                     className="block text-sm font-medium text-gray-300 mb-1"
                  >
                     Poster File (Optional)
                  </label>
                  <input
                     type="file"
                     id="posterFile"
                     name="posterFile"
                     accept="image/*"
                     onChange={handleFileChange}
                     className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600"
                     disabled={!!formData.posterUrl} // Disable if URL is provided
                  />
                  {posterFile && (
                     <p className="text-xs text-gray-400 mt-1">
                        Selected: {posterFile.name}
                     </p>
                  )}
               </div>
            </div>

            {/* Description */}
            <div>
               <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
               >
                  Description
               </label>
               <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1a1a1d] border border-gray-700 rounded-md text-white focus:ring-rose-500 focus:border-rose-500"
               ></textarea>
            </div>

            {/* Genres */}
            <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genres
               </label>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {genres.length === 0 && !error ? (
                     <p className="text-gray-400 col-span-full">
                        Loading genres...
                     </p>
                  ) : (
                     genres.map((genre) => (
                        <label
                           key={genre.id}
                           className="flex items-center text-sm text-gray-300"
                        >
                           <input
                              type="checkbox"
                              name="genreIds"
                              value={genre.id}
                              checked={formData.genreIds.includes(genre.id)}
                              onChange={handleChange}
                              className="h-4 w-4 text-rose-600 bg-gray-800 border-gray-600 rounded focus:ring-rose-500"
                           />
                           <span className="ml-2">{genre.name}</span>
                        </label>
                     ))
                  )}
               </div>
               {formData.genreIds.length === 0 && (
                  <p className="text-red-400 text-xs mt-2">
                     Please select at least one genre.
                  </p>
               )}
            </div>

            <div className="flex justify-end gap-4 mt-8">
               <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors text-sm"
               >
                  <X className="w-4 h-4" /> Cancel
               </button>
               <button
                  type="submit"
                  className={cn(
                     "flex items-center gap-1 px-4 py-2 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-md transition-colors text-sm",
                     loading && "opacity-70 cursor-not-allowed",
                  )}
                  disabled={loading || formData.genreIds.length === 0}
               >
                  {loading ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                     <Plus className="w-4 h-4" />
                  )}
                  {loading ? "Creating..." : "Create Movie"}
               </button>
            </div>
         </form>
      </div>
   );
};

export default MovieForm;
