import { useState, useEffect } from "react";
import { genreService } from "@/services/genreService";


export const useDashboardMovie = () => {
   const [movies, setMovies] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [genres, setGenres] = useState([]);

   useEffect(() => {
      // Fetch genres for the multi-select dropdown
      const fetchGenres = async () => {
         try {
            // Cập nhật để dùng searchGenres khớp với genreService.ts
            // Backend trả về Page object nên chúng ta lấy content
            const response: any = await genreService.searchGenres({
               size: 100,
            });
            setGenres(response.data.content || []);
         } catch (err) {
            console.error("Failed to fetch genres:", err);
            setError("Failed to load genres.");
         }
      };
      fetchGenres();
   }, []);
};
