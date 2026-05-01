import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Movie } from "../types";
import guardiansImg from "../../../assets/images/phim-kinh-di.png";

// Movie Card Component
const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
   return (
      <Link
         to={`/movies/${movie.id}`}
         className="bg-card-bg rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_16px_32px_rgba(248,69,101,0.2)] no-underline text-inherit"
      >
         <div className="w-full h-[250px] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
            <img
               src={movie.image || guardiansImg}
               alt={movie.title}
               className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 bg-green-300"
            />
         </div>

         <div className="p-3.5 flex flex-col gap-3 flex-grow">
            <h3 className="text-sm font-bold leading-tight text-white m-0">
               {movie.title}
            </h3>
            <p className="text-sm font-medium text-muted m-0 leading-loose">
               {movie.year} - {movie.genre} - {movie.duration}
            </p>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(248,69,101,0.2)]">
               <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold transition-all duration-300 hover:bg-[#ff5580] hover:scale-105 font-heebo">
                  Buy Ticket
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
