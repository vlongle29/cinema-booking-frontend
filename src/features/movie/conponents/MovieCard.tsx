import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Movie } from "../types";
import { API_BASE_URL } from "../../../constants/api";
import { formatDuration } from "@/lib/MovieUtils";

// Movie Card Component
const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
   return (
      <Link
         to={`/movies/${movie.id}`}
         className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(248,69,101,0.2)] no-underline text-inherit bg-[#1e2939]"
      >
         <div className="w-full h-[250px] overflow-hidden px-3 py-3">
            <img
               src={`${API_BASE_URL}${movie.posterUrl}`}
               alt={movie.title}
               className="w-full h-full object-cover rounded-xl transition-transform duration-300 bg-green-300"
            />
         </div>

         <div className="p-3.5 flex flex-col gap-3 flex-grow">
            <h3 className="text-sm font-bold leading-tight text-white m-0">
               {movie.title}
            </h3>
            <p className="text-sm font-medium text-muted m-0 leading-loose">
               {movie.releaseDate.substring(0, 4)} - {movie.genres[0].name} |{" "}
               {formatDuration(movie.durationMinutes)}
            </p>

            <div className="flex items-center justify-between mt-auto pb-2">
               <button className="px-4 py-1 bg-primary text-white rounded-full text-sm font-semibold transition-all duration-300 hover:bg-[#ff5580] hover:scale-105 font-heebo">
                  Mua vé
               </button>
               <div className="flex items-center gap-1.5 text-sm font-medium text-muted">
                  <Star size={18} fill="#F84565" stroke="#F84565" />
                  <span>{movie.rating}</span>
               </div>
            </div>
         </div>
      </Link>
   );
};

export default MovieCard;
