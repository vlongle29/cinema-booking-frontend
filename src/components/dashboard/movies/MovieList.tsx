
import { useState, useCallback, useEffect } from "react";
import type { Movie } from "../../../types/movie";
import { movieService } from "../../../services/movieService";
import { Filter, Search, Calendar, Monitor, Trash2, Loader2, RefreshCw, ChevronDown } from "lucide-react";

const STATUSES = ["COMING_SOON", "SHOWING", "ENDED"];

interface MovieListProps {
   onCreateClick: () => void;
}

export default function MovieList({ onCreateClick }: MovieListProps) {

   const [isLoadingList, setIsLoadingList] = useState(false);
   const [movies, setMovies] = useState<Movie[]>([]);
   const [searchParams, setSearchParams] = useState({
      keyword: "",
      status: "",
      releaseDateFrom: "",
      releaseDateTo: "",
      page: 1,
      size: 10
   });
   const [pagination, setPagination] = useState({
      totalPages: 1,
      totalElements: 0,
   });

   const fetchMovies = useCallback(async (params: any) => {
      setIsLoadingList(true);
      try {
         const response: any = await movieService.getAllMovies(params);
         if (response?.data?.content) {
            setMovies(response.data.content);
            setPagination({
               totalPages: response.data.totalPages,
               totalElements: response.data.totalElements,
            });
         }
      } catch (error) {
         console.error("Error fetching movies:", error);
      } finally {
         setIsLoadingList(false);
      }
   }, []);

   useEffect(() => {
      fetchMovies(searchParams);
   }, [fetchMovies, searchParams]);
   
   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSearchParams(prev => ({ ...prev, [name]: value, page: 1 }));
   };

   const resetFilters = () => {
      setSearchParams({ keyword: "", status: "", releaseDateFrom: "", releaseDateTo: "", page: 1, size: 10 });
   };

   const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xoá phim này?")) {
         try {
            await movieService.deleteMovie(id);
            fetchMovies(searchParams);
         } catch (err) {
            alert("Lỗi khi xoá phim");
         }
      }
   };

   const handlePageChange = (page: number) => {
      setSearchParams(prev => ({ ...prev, page }));
   };
   return (
     <div className="space-y-4">
         {/* Search Filters */}
         <div className="bg-[#1a1a1e] border border-[#393939] rounded-[8px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm">
               <Filter className="w-4 h-4 text-[#f84565]" /> Search Filters
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Keyword */}
               <div className="space-y-1.5">
                  <label className="text-[#797b7d] text-[10px] uppercase font-bold tracking-wider">Keyword</label>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#797b7d]" />
                     <input
                        type="text" name="keyword" placeholder="Title, director..."
                        value={searchParams.keyword} onChange={handleSearchChange}
                        className="w-full bg-[#252529] border border-[#393939] rounded-[6px] pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-[#f84565] transition-colors"
                     />
                  </div>
               </div>
               {/* Status */}
               <div className="space-y-1.5">
                  <label className="text-[#797b7d] text-[10px] uppercase font-bold tracking-wider">Status</label>
                  <select
                     name="status" value={searchParams.status} onChange={handleSearchChange}
                     className="w-full bg-[#252529] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-xs focus:outline-none focus:border-[#f84565] transition-colors"
                  >
                     <option value="">All Statuses</option>
                     {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
               </div>
               {/* Dates */}
               <div className="space-y-1.5">
                  <label className="text-[#797b7d] text-[10px] uppercase font-bold tracking-wider">From Date</label>
                  <input
                     type="date" name="releaseDateFrom" value={searchParams.releaseDateFrom} onChange={handleSearchChange}
                     className="w-full bg-[#252529] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-xs focus:outline-none focus:border-[#f84565] [color-scheme:dark] transition-colors"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[#797b7d] text-[10px] uppercase font-bold tracking-wider">To Date</label>
                  <input
                     type="date" name="releaseDateTo" value={searchParams.releaseDateTo} onChange={handleSearchChange}
                     className="w-full bg-[#252529] border border-[#393939] rounded-[6px] px-3 py-2 text-white text-xs focus:outline-none focus:border-[#f84565] [color-scheme:dark] transition-colors"
                  />
               </div>
            </div>
            <div className="flex justify-end mt-4 gap-2 border-t border-[#393939] pt-4">
               <button onClick={resetFilters} className="flex items-center gap-1.5 px-4 py-2 bg-[#252529] hover:bg-[#2d2d33] text-[#d1d5dc] text-xs font-semibold rounded-[6px] border border-[#393939] transition-all">
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
               </button>
            </div>
         </div>

         {/* Table List */}
         {isLoadingList ? (
            <div className="bg-[#1a1a1e] border border-[#393939] rounded-[8px] p-20 flex items-center justify-center">
               <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-[#f84565] animate-spin" />
                  <p className="text-[#797b7d] text-sm">Searching movies...</p>
               </div>
            </div>
         ) : movies.length > 0 ? (
            <div className="bg-[#1a1a1e] border border-[#393939] rounded-[8px] overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#252529] border-b border-[#393939]">
                           <th className="px-6 py-4 text-[10px] font-bold text-[#797b7d] uppercase tracking-wider">Movie</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-[#797b7d] uppercase tracking-wider">Director & Cast</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-[#797b7d] uppercase tracking-wider">Details</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-[#797b7d] uppercase tracking-wider">Status</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-[#797b7d] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#393939]">
                        {movies.map((movie) => (
                           <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-16 rounded-[4px] bg-[#252529] flex-shrink-0 overflow-hidden border border-[#393939]">
                                       <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/150x220?text=No+Poster"; }} />
                                    </div>
                                    <div className="max-w-[150px]">
                                       <p className="text-white text-sm font-semibold truncate group-hover:text-[#f84565] transition-colors">{movie.title}</p>
                                       <p className="text-[#797b7d] text-[11px] mt-1">{movie.durationMinutes} mins | {movie.rated}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="text-white text-sm font-medium">{movie.director}</div>
                                 <div className="text-[#797b7d] text-[11px] mt-1 truncate max-w-[200px]" title={movie.cast}>{movie.cast}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-col gap-1">
                                    <div className="text-[#d1d5dc] text-xs flex items-center gap-1.5"><Calendar className="w-3 h-3 text-[#f84565]" /> {new Date(movie.releaseDate).toLocaleDateString()}</div>
                                    <div className="text-[#797b7d] text-[11px] flex items-center gap-1.5"><Monitor className="w-3 h-3" /> {movie.language}</div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${movie.status === 'SHOWING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : movie.status === 'COMING_SOON' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                                    {movie.status.replace(/_/g, ' ')}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button onClick={() => handleDelete(movie.id)} className="p-2 text-[#797b7d] hover:text-[#f84565] hover:bg-[#f84565]/10 rounded-lg transition-all" title="Delete movie">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               {/* Pagination */}
               <div className="flex items-center justify-between px-6 py-4 bg-[#252529] border-t border-[#393939]">
                  <div className="text-[#797b7d] text-xs">Found <span className="text-white font-bold">{pagination.totalElements}</span> movies</div>
                  <div className="flex items-center gap-4">
                     <div className="text-[#797b7d] text-xs">Page <span className="text-white font-bold">{searchParams.page}</span> of <span className="text-white font-bold">{pagination.totalPages}</span></div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => setSearchParams(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))} disabled={searchParams.page === 1 || isLoadingList} className="p-2 bg-[#1a1a1e] border border-[#393939] rounded-[6px] text-white hover:bg-[#2d2d33] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDown className="w-4 h-4 rotate-90" /></button>
                        <button onClick={() => setSearchParams(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))} disabled={searchParams.page === pagination.totalPages || isLoadingList} className="p-2 bg-[#1a1a1e] border border-[#393939] rounded-[6px] text-white hover:bg-[#2d2d33] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDown className="w-4 h-4 -rotate-90" /></button>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="bg-[#1a1a1e] border border-[#393939] rounded-[8px] p-24 text-center">
               <div className="max-w-xs mx-auto">
                  <Search className="w-16 h-16 text-[#f84565] mx-auto mb-6 opacity-20" />
                  <h3 className="text-white text-lg font-semibold mb-2">No matching movies</h3>
                  <p className="text-[#797b7d] text-sm mb-6">We couldn't find any movies matching your filters. Try adjusting your search criteria.</p>
                  <button onClick={resetFilters} className="px-6 py-2 bg-[#f84565] text-white font-semibold rounded-[6px] hover:bg-[#f84565]/90 transition-all text-sm">Clear All Filters</button>
               </div>
            </div>
         )}
      </div>
   );
}