import { useState, useEffect } from "react";
import { Upload, X, Loader2, Film, Monitor, Filter } from "lucide-react";
import { movieService } from "../../../services/movieService";
import { genreService } from "../../../services/genreService";
import type { Genre, AgeRating, FormData } from "../../../types/movie";

const LANGUAGES = ["Vietnamese", "English", "Chinese", "Japanese", "Korean"];
const STATUSES = ["COMING_SOON", "SHOWING", "ENDED"];

interface MovieFormProps {
   onCancel: () => void;
   onSuccess: () => void;
}

export default function MovieForm({ onCancel, onSuccess }: MovieFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [genres, setGenres] = useState<Genre[]>([]);
   const [ageRatings, setAgeRatings] = useState<AgeRating[]>([]);
   
   const [formData, setFormData] = useState<FormData>({
      title: "", description: "", director: "", cast: "", durationMinutes: 0,
      releaseDate: "", posterUrl: "", trailerUrl: "", language: "Vietnamese",
      rated: "", status: "COMING_SOON", genreIds: [],
   });

   const [posterPreview, setPosterPreview] = useState<string | null>(null);
   const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
   const [uploadMode, setUploadMode] = useState({ poster: "url", trailer: "url" });

   useEffect(() => {
      const fetchInitialData = async () => {
         try {
            const [genresRes, ratingsRes]: any = await Promise.all([
               genreService.searchGenres({ size: 100 }),
               movieService.getAgeRating()
            ]);
            
            if (genresRes?.data?.content) setGenres(genresRes.data.content);
            if (ratingsRes?.data) {
               setAgeRatings(ratingsRes.data);
               setFormData(prev => ({ ...prev, rated: ratingsRes.data[0]?.name || "" }));
            }
         } catch (error) {
            console.error("Error fetching form data:", error);
         }
      };
      fetchInitialData();
   }, []);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: name === "durationMinutes" ? parseInt(value) || 0 : value }));
   };

   const handleGenreToggle = (genreId: string) => {
      setFormData((prev) => ({
         ...prev,
         genreIds: prev.genreIds.includes(genreId) ? prev.genreIds.filter((id) => id !== genreId) : [...prev.genreIds, genreId]
      }));
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "poster" | "trailer") => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (event) => {
            const result = event.target?.result as string;
            if (type === "poster") {
               setPosterPreview(result);
               setFormData(prev => ({ ...prev, posterUrl: result }));
            } else {
               setTrailerPreview(result);
               setFormData(prev => ({ ...prev, trailerUrl: result }));
            }
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         setIsSubmitting(true);
         const submitData = { ...formData, releaseDate: formData.releaseDate ? `${formData.releaseDate}` : null };
         await movieService.createMovie(submitData);
         alert("Tạo phim thành công!");
         onSuccess();
      } catch (error: any) {
         console.error("Error creating movie:", error);
         alert(error.message || "Đã xảy ra lỗi khi tạo phim.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-[8px] p-6 lg:p-8">
         <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
               <h3 className="text-white text-base font-semibold mb-3 flex items-center gap-2"><Film className="w-4 h-4 text-[#f84565]" /> Basic Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Title *</label>
                     <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter movie title" required className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Director *</label>
                     <input type="text" name="director" value={formData.director} onChange={handleInputChange} placeholder="Enter director name" required className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]" />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Cast *</label>
                     <input type="text" name="cast" value={formData.cast} onChange={handleInputChange} placeholder="Enter cast members (comma separated)" required className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]" />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Description *</label>
                     <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter show description" required rows={3} className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565] resize-none" />
                  </div>
               </div>
            </div>

            {/* Show Details */}
            <div className="pt-4 border-t border-[#393939]/30">
               <h3 className="text-white text-base font-semibold mb-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-[#f84565]" /> Movie Details</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Duration (minutes) *</label>
                     <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleInputChange} placeholder="120" required min="1" className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Release Date *</label>
                     <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565] [color-scheme:dark]" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Language *</label>
                     <select name="language" value={formData.language} onChange={handleInputChange} className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]">
                        {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Rating *</label>
                     <select name="rated" value={formData.rated} onChange={handleInputChange} className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]">
                        {ageRatings.map(r => <option key={r.id} value={r.name}>{r.name} - {r.description}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="block text-[#d1d5dc] text-xs font-medium">Status *</label>
                     <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]">
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                     </select>
                  </div>
               </div>
            </div>

            {/* Genres */}
            <div className="pt-4 border-t border-[#393939]/30">
               <h3 className="text-white text-base font-semibold mb-3 flex items-center gap-2"><Filter className="w-4 h-4 text-[#f84565]" /> Genres *</h3>
               <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                     <button key={genre.id} type="button" onClick={() => handleGenreToggle(genre.id)} className={`px-3 py-1.5 rounded-[6px] text-xs font-medium border transition-all ${formData.genreIds.includes(genre.id) ? "bg-[#f84565] border-[#f84565] text-white shadow-[0_0_8px_rgba(248,69,101,0.3)]" : "bg-[#1a1a1e] border-[#393939] text-[#d1d5dc] hover:border-[#f84565] hover:text-white"}`}>
                        {genre.name}
                     </button>
                  ))}
               </div>
            </div>

            {/* Media Uploads */}
            <div className="pt-4 border-t border-[#393939]/30 grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Poster */}
               <div className="space-y-4">
                  <h3 className="text-white text-base font-semibold flex items-center gap-2"><Upload className="w-4 h-4 text-[#f84565]" /> Poster Image *</h3>
                  <div className="flex gap-2">
                     <button type="button" onClick={() => setUploadMode(p => ({ ...p, poster: "url" }))} className={`px-3 py-1 rounded-[4px] text-[10px] font-bold uppercase ${uploadMode.poster === "url" ? 'bg-[#f84565] text-white' : 'bg-[#1a1a1e] text-[#797b7d] border border-[#393939]'}`}>URL</button>
                     <button type="button" onClick={() => setUploadMode(p => ({ ...p, poster: "file" }))} className={`px-3 py-1 rounded-[4px] text-[10px] font-bold uppercase ${uploadMode.poster === "file" ? 'bg-[#f84565] text-white' : 'bg-[#1a1a1e] text-[#797b7d] border border-[#393939]'}`}>Upload</button>
                  </div>
                  {uploadMode.poster === "url" ? (
                     <input type="url" value={formData.posterUrl} onChange={e => setFormData(p => ({ ...p, posterUrl: e.target.value }))} placeholder="https://example.com/poster.jpg" required className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]" />
                  ) : (
                     <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#393939] rounded-[6px] cursor-pointer hover:border-[#f84565] bg-[#1a1a1e]/50"><Upload className="w-6 h-6 text-[#797b7d] mb-2" /><span className="text-[#d1d5dc] text-xs">Drop or click</span><input type="file" accept="image/*" onChange={e => handleFileChange(e, "poster")} className="hidden" required /></label>
                  )}
                  {posterPreview && (
                     <div className="relative w-24 h-36 rounded-lg overflow-hidden border border-[#393939]">
                        <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setPosterPreview(null); setFormData(p => ({...p, posterUrl: ""})) }} className="absolute top-1 right-1 bg-red-600 rounded-full p-1"><X className="w-3 h-3 text-white" /></button>
                     </div>
                  )}
               </div>

               {/* Trailer */}
               <div className="space-y-4">
                  <h3 className="text-white text-base font-semibold flex items-center gap-2"><Upload className="w-4 h-4 text-[#f84565]" /> Trailer Video *</h3>
                  <div className="flex gap-2">
                     <button type="button" onClick={() => setUploadMode(p => ({ ...p, trailer: "url" }))} className={`px-3 py-1 rounded-[4px] text-[10px] font-bold uppercase ${uploadMode.trailer === "url" ? 'bg-[#f84565] text-white' : 'bg-[#1a1a1e] text-[#797b7d] border border-[#393939]'}`}>URL</button>
                     <button type="button" onClick={() => setUploadMode(p => ({ ...p, trailer: "file" }))} className={`px-3 py-1 rounded-[4px] text-[10px] font-bold uppercase ${uploadMode.trailer === "file" ? 'bg-[#f84565] text-white' : 'bg-[#1a1a1e] text-[#797b7d] border border-[#393939]'}`}>Upload</button>
                  </div>
                  {uploadMode.trailer === "url" ? (
                     <input type="url" value={formData.trailerUrl} onChange={e => setFormData(p => ({ ...p, trailerUrl: e.target.value }))} placeholder="https://example.com/trailer.mp4" required className="w-full bg-[#1a1a1e] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f84565]" />
                  ) : (
                     <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#393939] rounded-[6px] cursor-pointer hover:border-[#f84565] bg-[#1a1a1e]/50"><Upload className="w-6 h-6 text-[#797b7d] mb-2" /><span className="text-[#d1d5dc] text-xs">Drop or click</span><input type="file" accept="video/*" onChange={e => handleFileChange(e, "trailer")} className="hidden" required /></label>
                  )}
                  {trailerPreview && (
                     <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-[#393939]">
                        <video src={trailerPreview} className="w-full h-full object-cover" controls />
                        <button type="button" onClick={() => { setTrailerPreview(null); setFormData(p => ({...p, trailerUrl: ""})) }} className="absolute top-1 right-1 bg-red-600 rounded-full p-1"><X className="w-3 h-3 text-white" /></button>
                     </div>
                  )}
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-[#393939]">
               <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-[#f84565] hover:bg-[#f84565]/90 text-white font-bold rounded-[6px] transition-all shadow-lg active:scale-95 disabled:opacity-50">
                  {isSubmitting ? <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Adding...</div> : "Add Movie"}
               </button>
               <button type="button" onClick={onCancel} className="px-8 py-2.5 bg-[#1a1a1e] hover:bg-[#252529] text-[#d1d5dc] font-bold border border-[#393939] rounded-[6px] transition-all">Cancel</button>
            </div>
         </form>
      </div>
   );
}