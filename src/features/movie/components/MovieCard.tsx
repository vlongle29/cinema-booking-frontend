import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Movie } from "@/types/movie";
import { API_BASE_URL } from "../../../constants/api";
import { formatDuration } from "@/utils/formatters";

// Movie Card Component
const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
   return (
      <Link
         to={`/movies/${movie.id}`}
         className="z-50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(245,158,11,0.15)] no-underline text-inherit bg-white border border-slate-200 shadow-sm"
      >
         <div className="w-full h-[250px] overflow-hidden px-3 py-3">
            <img
               src={`${API_BASE_URL}${movie.posterUrl}`}
               alt={movie.title}
               className="w-full h-full object-cover rounded-xl transition-transform duration-300 bg-slate-100"
            />
         </div>

         <div className="p-3.5 flex flex-col gap-3 flex-grow">
            <h3 className="text-sm font-bold leading-tight text-slate-900 m-0">
               {movie.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 m-0 leading-loose">
               {movie.releaseDate.substring(0, 4)} - {movie.genres[0].name} |{" "}
               {formatDuration(movie.durationMinutes)}
            </p>

            <div className="flex items-center justify-between mt-auto pb-2">
               <button className="px-4 py-1.5 bg-amber-500 text-white rounded-full text-sm font-semibold transition-all duration-300 hover:bg-amber-600 hover:scale-105 font-heebo shadow-sm">
                  Mua vé
               </button>
               <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <Star size={18} fill="#f59e0b" stroke="#f59e0b" />
                  <span className="text-slate-700">{movie.rating}</span>
               </div>
            </div>
         </div>
      </Link>
   );
};

export default MovieCard;
