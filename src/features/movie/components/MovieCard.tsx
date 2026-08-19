import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Ticket, Play } from "lucide-react";
import type { Movie } from "@/types/movie";
import { API_BASE_URL } from "../../../constants/api";
import { formatDuration } from "@/utils/formatters";

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
   const [imgError, setImgError] = useState(false);

   return (
      <Link
         to={`/movies/${movie.id}`}
         className="group relative rounded-2xl overflow-hidden flex flex-col no-underline text-inherit transition-all duration-300 hover:-translate-y-1.5"
         style={{
            background: "#fff",
            boxShadow: "0 2px 12px rgba(15,15,30,0.06)",
         }}
         onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
               "0 20px 48px rgba(245,158,11,0.18), 0 4px 16px rgba(15,15,30,0.08)";
         }}
         onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
               "0 2px 12px rgba(15,15,30,0.06)";
         }}
      >
         {/* Poster */}
         <div className="relative w-full overflow-hidden" style={{ height: "260px" }}>
            <img
               src={imgError ? "/src/assets/images/hero-bg.jpg" : `${API_BASE_URL}${movie.posterUrl}`}
               alt={movie.title}
               onError={() => setImgError(true)}
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark overlay on hover */}
            <div
               className="absolute inset-0 transition-opacity duration-300"
               style={{
                  background:
                     "linear-gradient(to top, rgba(10,8,20,0.85) 0%, rgba(10,8,20,0.2) 50%, transparent 100%)",
                  opacity: 0,
               }}
               ref={(el) => {
                  if (!el) return;
                  const parent = el.closest(".group");
                  if (!parent) return;
                  const onEnter = () => (el.style.opacity = "1");
                  const onLeave = () => (el.style.opacity = "0");
                  parent.addEventListener("mouseenter", onEnter);
                  parent.addEventListener("mouseleave", onLeave);
               }}
            />

            {/* Play button revealed on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
               <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/80"
                  style={{ background: "rgba(245,158,11,0.9)" }}
               >
                  <Play size={18} fill="white" className="ml-0.5" />
               </div>
            </div>

            {/* Rating pill */}
            {movie.rating != null && (
               <div
                  className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{
                     background: "rgba(10,8,20,0.65)",
                     backdropFilter: "blur(8px)",
                  }}
               >
                  <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                  <span className="text-white font-bold text-xs">{movie.rating}</span>
               </div>
            )}

            {/* Genre chip */}
            {movie.genres?.[0] && (
               <div
                  className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wide"
                  style={{ background: "rgba(245,158,11,0.85)" }}
               >
                  {movie.genres[0].name}
               </div>
            )}
         </div>

         {/* Info */}
         <div className="p-4 flex flex-col gap-1.5 flex-grow border-t border-slate-100">
            <h3 className="text-sm font-bold leading-snug text-slate-900 line-clamp-2 m-0">
               {movie.title}
            </h3>
            <p className="text-xs text-slate-400 m-0">
               {movie.releaseDate?.substring(0, 4)} &middot; {formatDuration(movie.durationMinutes)}
            </p>

            <div className="mt-auto pt-3 flex items-center gap-2">
               <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-all duration-300 hover:brightness-110 active:scale-95"
                  style={{
                     background: "linear-gradient(135deg, #f59e0b, #d97706)",
                     boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                  }}
                  onClick={(e) => e.preventDefault()}
               >
                  <Ticket size={13} />
                  Mua vé
               </button>
            </div>
         </div>
      </Link>
   );
};

export default MovieCard;
