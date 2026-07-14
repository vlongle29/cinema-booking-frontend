// 👉 Đặt tại: src/features/movies/hooks/useNowShowingMovies.ts
import { useState, useEffect } from "react";
import { movieService } from "@/services/movieService";
import type { Movie } from "@/types/movie";
import useAuth from "@/features/auth/hooks/useAuth"; // Import từ cổng feature auth

export const useNowShowingMovies = () => {
   const [movies, setMovies] = useState<Movie[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const { userInfo } = useAuth();

   useEffect(() => {
      const fetchMovies = async () => {
         try {
            setIsLoading(true);
            const response = (await movieService.getAllMovies({
               status: "SHOWING",
            })) as any;

            if (response && response.data) {
               setMovies(response.data.content);
            } else if (Array.isArray(response)) {
               setMovies(response);
            }
         } catch (error) {
            console.error("Failed to fetch movies:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchMovies();
   }, [userInfo]);

   return { movies, isLoading };
};
