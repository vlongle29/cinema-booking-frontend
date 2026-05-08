import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Movie } from "../features/movie/types";
import MovieCard from "../features/movie/conponents/MovieCard";
import { movieService } from "@/services/movieService";

function ListMoviesPage() {
   const [movies, setMovies] = useState<Movie[]>([]);
   const { status } = useParams<{ status: string }>();

   console.log("status", status);

   useEffect(() => {
      const fetchMovies = async () => {
         try {
            const response = (await movieService.getAllMovies({
               status: status,
            })) as { data: { content: Movie[] } };
            setMovies(response.data.content);
         } catch (error) {
            console.error("Error fetching movies:", error);
         }
      };

      fetchMovies();
   }, [status]);

   return (
      <section className="max-w-7xl mx-auto py-10 sm:py-14 md:py-28 px-4 sm:px-6 lg:px-10">
         <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-secondary">
               {status === "SHOWING"
                  ? "Phim đang chiếu"
                  : status === "COMING_SOON"
                    ? "Phim sắp chiếu"
                    : "Movies"}
            </h2>
            <a
               href="#view-all"
               className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#99a1af] no-underline transition-all duration-300 hover:text-primary hover:gap-3"
            >
               View All{" "}
               <ArrowRight size={16} className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {movies.map((movie) => (
               <MovieCard key={movie.id} movie={movie} />
            ))}
         </div>

         <div className="flex justify-center mt-6 sm:mt-10">
            <button className="px-5 py-2.5 sm:px-6 sm:py-3 bg-primary text-white rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-[#ff5580] hover:-translate-y-0.5">
               Show more
            </button>
         </div>
      </section>
   );
}

export default ListMoviesPage;
