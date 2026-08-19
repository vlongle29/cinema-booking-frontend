import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clapperboard } from "lucide-react";
import MovieCard from "./MovieCard";
import { useNowShowingMovies } from "../hooks/useNowShowingMovies";

const MovieCardSkeleton: React.FC = () => (
   <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm animate-pulse">
      <div className="w-full h-[250px] bg-slate-200 m-3 rounded-xl" style={{ width: "calc(100% - 24px)" }} />
      <div className="p-4 flex flex-col gap-3">
         <div className="h-4 bg-slate-200 rounded-full w-3/4" />
         <div className="h-3 bg-slate-200 rounded-full w-1/2" />
         <div className="flex justify-between mt-2">
            <div className="h-7 bg-slate-200 rounded-full w-20" />
            <div className="h-7 bg-slate-200 rounded-full w-12" />
         </div>
      </div>
   </div>
);

export const NowShowingSection: React.FC = () => {
   const { movies, isLoading } = useNowShowingMovies();

   return (
      <section className="relative w-full py-16 sm:py-20 overflow-hidden" style={{ background: "#fefce8" }}>
         {/* Decorative background blobs */}
         <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
            style={{
               background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
            }}
         />
         <div
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
            style={{
               background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
            }}
         />

         <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-1 h-5 rounded-full bg-amber-500" />
                     <span className="text-xs font-bold text-amber-600 uppercase tracking-[0.18em]">
                        Cập nhật mới nhất
                     </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 leading-tight flex items-center gap-3">
                     Phim đang chiếu
                     <Clapperboard size={28} className="text-amber-500 mb-0.5" />
                  </h2>
               </div>

               <Link
                  to="/movies/status/SHOWING"
                  className="group hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors duration-300 no-underline"
               >
                  Xem tất cả
                  <span
                     className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white"
                     style={{ background: "rgba(245,158,11,0.12)" }}
                  >
                     <ArrowRight size={14} className="text-amber-500 group-hover:text-white" />
                  </span>
               </Link>
            </div>

            {/* Movie grid */}
            {isLoading ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                     <MovieCardSkeleton key={i} />
                  ))}
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {movies.map((movie) => (
                     <MovieCard key={movie.id} movie={movie} />
                  ))}
               </div>
            )}

            {/* Bottom CTA row */}
            <div className="flex items-center justify-center mt-10 gap-4">
               <div className="flex-1 h-px bg-slate-200 max-w-[120px]" />
               <Link
                  to="/movies/status/SHOWING"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300 no-underline"
               >
                  Xem thêm phim <ArrowRight size={15} />
               </Link>
               <div className="flex-1 h-px bg-slate-200 max-w-[120px]" />
            </div>
         </div>
      </section>
   );
};
