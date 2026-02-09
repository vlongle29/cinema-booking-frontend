import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";

interface Movie {
   id: string;
   title: string;
   director: string;
   releaseDate: string;
   status: string;
   posterUrl: string;
   durationMinutes: number;
}

interface FormData {
   title: string;
   description: string;
   director: string;
   cast: string;
   durationMinutes: number;
   releaseDate: string;
   posterUrl: string;
   trailerUrl: string;
   language: string;
   rated: string;
   status: string;
   genreIds: string[];
}

const LANGUAGES = ["Vietnamese", "English", "Chinese", "Japanese", "Korean"];
const RATINGS = ["G", "PG", "PG-13", "16+", "18+"];
const STATUSES = ["COMING_SOON", "NOW_SHOWING", "ARCHIVED"];
const GENRES = [
   { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", name: "Action" },
   { id: "action-adventure", name: "Adventure" },
   { id: "drama", name: "Drama" },
   { id: "thriller", name: "Thriller" },
   { id: "comedy", name: "Comedy" },
   { id: "horror", name: "Horror" },
];

// Mock movies data - replace with API call
const MOCK_MOVIES: Movie[] = [
   {
      id: "1",
      title: "The Shawshank Redemption",
      director: "Frank Darabont",
      releaseDate: "1994-09-23",
      status: "NOW_SHOWING",
      posterUrl: "https://via.placeholder.com/300x450?text=Shawshank",
      durationMinutes: 142,
   },
   {
      id: "2",
      title: "The Dark Knight",
      director: "Christopher Nolan",
      releaseDate: "2008-07-18",
      status: "NOW_SHOWING",
      posterUrl: "https://via.placeholder.com/300x450?text=DarkKnight",
      durationMinutes: 152,
   },
   {
      id: "3",
      title: "Inception",
      director: "Christopher Nolan",
      releaseDate: "2010-07-16",
      status: "ARCHIVED",
      posterUrl: "https://via.placeholder.com/300x450?text=Inception",
      durationMinutes: 148,
   },
];

export default function AddMovies() {
   const [isCreating, setIsCreating] = useState(false);
   const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);

   const [formData, setFormData] = useState<FormData>({
      title: "",
      description: "",
      director: "",
      cast: "",
      durationMinutes: 0,
      releaseDate: "",
      posterUrl: "",
      trailerUrl: "",
      language: "Vietnamese",
      rated: "PG",
      status: "COMING_SOON",
      genreIds: [],
   });

   const [posterPreview, setPosterPreview] = useState<string | null>(null);
   const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
   const [uploadMode, setUploadMode] = useState<{
      poster: "url" | "file";
      trailer: "url" | "file";
   }>({
      poster: "url",
      trailer: "url",
   });

   const handleInputChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: name === "durationMinutes" ? parseInt(value) || 0 : value,
      }));
   };

   const handleFileChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      type: "poster" | "trailer",
   ) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (event) => {
            const result = event.target?.result as string;
            if (type === "poster") {
               setPosterPreview(result);
               setFormData((prev) => ({
                  ...prev,
                  posterUrl: result,
               }));
            } else {
               setTrailerPreview(result);
               setFormData((prev) => ({
                  ...prev,
                  trailerUrl: result,
               }));
            }
         };
         reader.readAsDataURL(file);
      }
   };

   const handleGenreToggle = (genreId: string) => {
      setFormData((prev) => {
         const newGenreIds = prev.genreIds.includes(genreId)
            ? prev.genreIds.filter((id) => id !== genreId)
            : [...prev.genreIds, genreId];
         return {
            ...prev,
            genreIds: newGenreIds,
         };
      });
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form Data:", formData);

      // Add new movie to the list
      const newMovie: Movie = {
         id: Date.now().toString(),
         title: formData.title,
         director: formData.director,
         releaseDate: formData.releaseDate,
         status: formData.status,
         posterUrl: formData.posterUrl,
         durationMinutes: formData.durationMinutes,
      };

      setMovies((prev) => [newMovie, ...prev]);

      // Reset form and close creation panel
      setFormData({
         title: "",
         description: "",
         director: "",
         cast: "",
         durationMinutes: 0,
         releaseDate: "",
         posterUrl: "",
         trailerUrl: "",
         language: "Vietnamese",
         rated: "PG",
         status: "COMING_SOON",
         genreIds: [],
      });
      setPosterPreview(null);
      setTrailerPreview(null);
      setIsCreating(false);
   };

   const resetForm = () => {
      setFormData({
         title: "",
         description: "",
         director: "",
         cast: "",
         durationMinutes: 0,
         releaseDate: "",
         posterUrl: "",
         trailerUrl: "",
         language: "Vietnamese",
         rated: "PG",
         status: "COMING_SOON",
         genreIds: [],
      });
      setPosterPreview(null);
      setTrailerPreview(null);
      setIsCreating(false);
   };

   const clearPosterPreview = () => {
      setPosterPreview(null);
      setFormData((prev) => ({ ...prev, posterUrl: "" }));
   };

   const clearTrailerPreview = () => {
      setTrailerPreview(null);
      setFormData((prev) => ({ ...prev, trailerUrl: "" }));
   };

   return (
      <>
         {!isCreating ? (
            // Movies List View
            <>
               <div className="mb-12 mt-6 flex items-center justify-between">
                  <h1 className="text-4xl font-semibold text-white">
                     All{" "}
                     <span className="underline decoration-[#f84565] text-[#f84565]">
                        Movies
                     </span>
                  </h1>
                  <button
                     onClick={() => setIsCreating(true)}
                     className="flex items-center gap-2 px-6 py-3 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-[6px] transition-colors"
                  >
                     <Plus className="w-5 h-5" />
                     Create Movie
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {movies.map((movie) => (
                     <div
                        key={movie.id}
                        className="bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-[8px] overflow-hidden hover:border-[#f84565] transition-colors"
                     >
                        <div className="h-48 overflow-hidden bg-[#1a1a1e]">
                           <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                           />
                        </div>
                        <div className="p-4">
                           <h3 className="text-white font-semibold mb-2 truncate">
                              {movie.title}
                           </h3>
                           <p className="text-[#d1d5dc] text-sm mb-2">
                              {movie.director}
                           </p>
                           <div className="flex items-center justify-between mb-3">
                              <span className="text-[#797b7d] text-xs">
                                 {movie.durationMinutes} mins
                              </span>
                              <span
                                 className={`text-xs font-semibold px-2 py-1 rounded ${
                                    movie.status === "NOW_SHOWING"
                                       ? "bg-green-500/20 text-green-400"
                                       : movie.status === "COMING_SOON"
                                         ? "bg-blue-500/20 text-blue-400"
                                         : "bg-gray-500/20 text-gray-400"
                                 }`}
                              >
                                 {movie.status.replace(/_/g, " ")}
                              </span>
                           </div>
                           <p className="text-[#797b7d] text-xs">
                              {new Date(movie.releaseDate).toLocaleDateString()}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </>
         ) : (
            // Create Movie Form View
            <>
               <div className="mb-12 mt-6 flex items-center gap-4">
                  <button
                     onClick={() => resetForm()}
                     className="text-[#d1d5dc] hover:text-white transition-colors"
                  >
                     ← Back to List
                  </button>
                  <h1 className="text-4xl font-semibold text-white">
                     Create{" "}
                     <span className="underline decoration-[#f84565] text-[#f84565]">
                        Movie
                     </span>
                  </h1>
               </div>

               <div className="bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-[8px] p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                     {/* Basic Information */}
                     <div>
                        <h3 className="text-white text-lg font-semibold mb-6">
                           Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                           {/* Title */}
                           <div>
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Title *
                              </label>
                              <input
                                 type="text"
                                 name="title"
                                 value={formData.title}
                                 onChange={handleInputChange}
                                 placeholder="Enter show title"
                                 required
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white placeholder-[#797b7d] focus:outline-none focus:border-[#f84565]"
                              />
                           </div>

                           {/* Director */}
                           <div>
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Director *
                              </label>
                              <input
                                 type="text"
                                 name="director"
                                 value={formData.director}
                                 onChange={handleInputChange}
                                 placeholder="Enter director name"
                                 required
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white placeholder-[#797b7d] focus:outline-none focus:border-[#f84565]"
                              />
                           </div>

                           {/* Cast */}
                           <div className="col-span-2">
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Cast *
                              </label>
                              <input
                                 type="text"
                                 name="cast"
                                 value={formData.cast}
                                 onChange={handleInputChange}
                                 placeholder="Enter cast members (comma separated)"
                                 required
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white placeholder-[#797b7d] focus:outline-none focus:border-[#f84565]"
                              />
                           </div>

                           {/* Description */}
                           <div className="col-span-2">
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Description *
                              </label>
                              <textarea
                                 name="description"
                                 value={formData.description}
                                 onChange={handleInputChange}
                                 placeholder="Enter show description"
                                 required
                                 rows={4}
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white placeholder-[#797b7d] focus:outline-none focus:border-[#f84565] resize-none"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Show Details */}
                     <div>
                        <h3 className="text-white text-lg font-semibold mb-6">
                           Show Details
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                           {/* Duration */}
                           <div>
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Duration (minutes) *
                              </label>
                              <input
                                 type="number"
                                 name="durationMinutes"
                                 value={formData.durationMinutes}
                                 onChange={handleInputChange}
                                 placeholder="120"
                                 required
                                 min="0"
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white placeholder-[#797b7d] focus:outline-none focus:border-[#f84565]"
                              />
                           </div>

                           {/* Release Date */}
                           <div>
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Release Date *
                              </label>
                              <input
                                 type="date"
                                 name="releaseDate"
                                 value={formData.releaseDate}
                                 onChange={handleInputChange}
                                 required
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white placeholder-[#797b7d] focus:outline-none focus:border-[#f84565]"
                              />
                           </div>

                           {/* Language */}
                           <div>
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Language *
                              </label>
                              <select
                                 name="language"
                                 value={formData.language}
                                 onChange={handleInputChange}
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white focus:outline-none focus:border-[#f84565]"
                              >
                                 {LANGUAGES.map((lang) => (
                                    <option key={lang} value={lang}>
                                       {lang}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           {/* Rating */}
                           <div>
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Rating *
                              </label>
                              <select
                                 name="rated"
                                 value={formData.rated}
                                 onChange={handleInputChange}
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white focus:outline-none focus:border-[#f84565]"
                              >
                                 {RATINGS.map((rating) => (
                                    <option key={rating} value={rating}>
                                       {rating}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           {/* Status */}
                           <div className="col-span-2">
                              <label className="block text-[#d1d5dc] text-sm font-medium mb-2">
                                 Status *
                              </label>
                              <select
                                 name="status"
                                 value={formData.status}
                                 onChange={handleInputChange}
                                 className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white focus:outline-none focus:border-[#f84565]"
                              >
                                 {STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                       {status.replace(/_/g, " ")}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </div>

                     {/* Genres */}
                     <div>
                        <h3 className="text-white text-lg font-semibold mb-6">
                           Genres *
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                           {GENRES.map((genre) => (
                              <label
                                 key={genre.id}
                                 className="flex items-center cursor-pointer"
                              >
                                 <input
                                    type="checkbox"
                                    checked={formData.genreIds.includes(
                                       genre.id,
                                    )}
                                    onChange={() => handleGenreToggle(genre.id)}
                                    className="w-4 h-4 rounded border-[#393939] bg-[#1a1a1e] text-[#f84565] focus:ring-[#f84565]"
                                 />
                                 <span className="ml-3 text-[#d1d5dc] text-sm">
                                    {genre.name}
                                 </span>
                              </label>
                           ))}
                        </div>
                     </div>

                     {/* Poster */}
                     <div>
                        <h3 className="text-white text-lg font-semibold mb-6">
                           Poster Image *
                        </h3>
                        <div className="flex gap-4 mb-4">
                           <button
                              type="button"
                              onClick={() =>
                                 setUploadMode((prev) => ({
                                    ...prev,
                                    poster: "url",
                                 }))
                              }
                              className={`px-4 py-2 rounded-[6px] font-medium text-sm transition-colors ${
                                 uploadMode.poster === "url"
                                    ? "bg-[#f84565] text-white"
                                    : "bg-[#1a1a1e] text-[#d1d5dc] border border-[#393939]"
                              }`}
                           >
                              URL
                           </button>
                           <button
                              type="button"
                              onClick={() =>
                                 setUploadMode((prev) => ({
                                    ...prev,
                                    poster: "file",
                                 }))
                              }
                              className={`px-4 py-2 rounded-[6px] font-medium text-sm transition-colors ${
                                 uploadMode.poster === "file"
                                    ? "bg-[#f84565] text-white"
                                    : "bg-[#1a1a1e] text-[#d1d5dc] border border-[#393939]"
                              }`}
                           >
                              Upload File
                           </button>
                        </div>

                        {uploadMode.poster === "url" ? (
                           <input
                              type="url"
                              value={formData.posterUrl}
                              onChange={(e) =>
                                 setFormData((prev) => ({
                                    ...prev,
                                    posterUrl: e.target.value,
                                 }))
                              }
                              placeholder="https://example.com/poster.jpg"
                              required
                              className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white placeholder-[#797b7d] focus:outline-none focus:border-[#f84565]"
                           />
                        ) : (
                           <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#393939] rounded-[6px] p-8 cursor-pointer hover:border-[#f84565] transition-colors">
                              <Upload className="w-8 h-8 text-[#797b7d] mb-2" />
                              <span className="text-[#d1d5dc] text-sm">
                                 Click to upload or drag and drop
                              </span>
                              <input
                                 type="file"
                                 accept="image/*"
                                 onChange={(e) => handleFileChange(e, "poster")}
                                 className="hidden"
                                 required
                              />
                           </label>
                        )}

                        {posterPreview && (
                           <div className="mt-4 relative w-32 h-48">
                              <img
                                 src={posterPreview}
                                 alt="Poster preview"
                                 className="w-full h-full object-cover rounded-[6px]"
                              />
                              <button
                                 type="button"
                                 onClick={clearPosterPreview}
                                 className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded-full p-1"
                              >
                                 <X className="w-4 h-4 text-white" />
                              </button>
                           </div>
                        )}
                     </div>

                     {/* Trailer */}
                     <div>
                        <h3 className="text-white text-lg font-semibold mb-6">
                           Trailer Video *
                        </h3>
                        <div className="flex gap-4 mb-4">
                           <button
                              type="button"
                              onClick={() =>
                                 setUploadMode((prev) => ({
                                    ...prev,
                                    trailer: "url",
                                 }))
                              }
                              className={`px-4 py-2 rounded-[6px] font-medium text-sm transition-colors ${
                                 uploadMode.trailer === "url"
                                    ? "bg-[#f84565] text-white"
                                    : "bg-[#1a1a1e] text-[#d1d5dc] border border-[#393939]"
                              }`}
                           >
                              URL
                           </button>
                           <button
                              type="button"
                              onClick={() =>
                                 setUploadMode((prev) => ({
                                    ...prev,
                                    trailer: "file",
                                 }))
                              }
                              className={`px-4 py-2 rounded-[6px] font-medium text-sm transition-colors ${
                                 uploadMode.trailer === "file"
                                    ? "bg-[#f84565] text-white"
                                    : "bg-[#1a1a1e] text-[#d1d5dc] border border-[#393939]"
                              }`}
                           >
                              Upload File
                           </button>
                        </div>

                        {uploadMode.trailer === "url" ? (
                           <input
                              type="url"
                              value={formData.trailerUrl}
                              onChange={(e) =>
                                 setFormData((prev) => ({
                                    ...prev,
                                    trailerUrl: e.target.value,
                                 }))
                              }
                              placeholder="https://example.com/trailer.mp4"
                              required
                              className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-4 py-2 text-white placeholder-[#797b7d] focus:outline-none focus:border-[#f84565]"
                           />
                        ) : (
                           <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#393939] rounded-[6px] p-8 cursor-pointer hover:border-[#f84565] transition-colors">
                              <Upload className="w-8 h-8 text-[#797b7d] mb-2" />
                              <span className="text-[#d1d5dc] text-sm">
                                 Click to upload or drag and drop
                              </span>
                              <input
                                 type="file"
                                 accept="video/*"
                                 onChange={(e) =>
                                    handleFileChange(e, "trailer")
                                 }
                                 className="hidden"
                                 required
                              />
                           </label>
                        )}

                        {trailerPreview && (
                           <div className="mt-4 relative w-full max-w-md h-64">
                              <video
                                 src={trailerPreview}
                                 className="w-full h-full object-cover rounded-[6px]"
                                 controls
                              />
                              <button
                                 type="button"
                                 onClick={clearTrailerPreview}
                                 className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded-full p-1"
                              >
                                 <X className="w-4 h-4 text-white" />
                              </button>
                           </div>
                        )}
                     </div>

                     {/* Submit Button */}
                     <div className="flex gap-4">
                        <button
                           type="submit"
                           className="px-8 py-3 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-semibold rounded-[6px] transition-colors"
                        >
                           Add Show
                        </button>
                        <button
                           type="button"
                           onClick={() => resetForm()}
                           className="px-8 py-3 bg-[#1a1a1e] hover:bg-[#252529] text-[#d1d5dc] font-semibold border border-[#393939] rounded-[6px] transition-colors"
                        >
                           Cancel
                        </button>
                     </div>
                  </form>
               </div>
            </>
         )}
      </>
   );
}
