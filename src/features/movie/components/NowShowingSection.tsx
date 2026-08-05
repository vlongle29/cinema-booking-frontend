import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BlurredCircle from "@/components/ui/BlurredCircle";
import MovieCard from "./MovieCard";
import { useNowShowingMovies } from "../hooks/useNowShowingMovies";

export const NowShowingSection: React.FC = () => {
   const { movies, isLoading } = useNowShowingMovies();

   return (
      <section className="max-w-7xl mx-auto py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-10">
         <div className="relative flex items-center justify-between mb-6">
            <BlurredCircle className="z-0 -top-10 -right-20" />
            <h2 className="text-lg sm:text-xl text-slate-700 font-bold text-secondary">
               Phim đang chiếu
            </h2>
            <Link
               to="/movies/status/SHOWING"
               className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-amber-600 transition-all"
            >
               Xem tất cả <ArrowRight size={16} />
            </Link>
         </div>

         {isLoading ? (
            <div className="text-center text-slate-500 py-10 font-medium">
               Đang tải danh sách phim...
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
               {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
               ))}
            </div>
         )}

         <div className="flex justify-center mt-6">
            <button className="px-6 py-2.5 bg-amber-500 text-white rounded-full text-sm font-bold hover:bg-amber-600 transition-all shadow-sm">
               Xem thêm
            </button>
         </div>
      </section>
   );
};
