import { useState, useEffect } from "react";
import type { Movie } from "@/types/movie";
import { movieService } from "../../../services/movieService";

export const useMovieDetails = (movieId: string | undefined) => {
   const [movieDetail, setMovieDetail] = useState<Movie>();
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (!movieId) return;

      const fetchMovieDetail = async () => {
         try {
            setIsLoading(true);
            const response = await movieService.getMovieById(movieId);
            setMovieDetail(response.data);
         } catch (error) {
            console.error("Failed to fetch movie detail:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchMovieDetail();
   }, [movieId]);

   return { movieDetail, isLoading };
};
