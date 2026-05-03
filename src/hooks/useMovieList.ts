import { useState, useCallback, useEffect } from "react";
import { movieService } from "../services/movieService";
import type { Movie } from "../types/movie";

export const useMovieList = (isCreating: boolean) => {
   const [movies, setMovies] = useState<Movie[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [searchParams, setSearchParams] = useState<any>({
      page: 1,
      size: 10,
      keyword: "",
      status: "",
      releaseDateFrom: "",
      releaseDateTo: "",
   });
   const [pagination, setPagination] = useState({
      totalPages: 1,
      totalElements: 0,
   });

   const fetchMovies = useCallback(async (params: any) => {
      setIsLoading(true);
      try {
         const response: any = await movieService.getAllMovies(params);
         if (response?.data?.content) {
            setMovies(response.data.content);
            setPagination({
               totalPages: response.data.totalPages,
               totalElements: response.data.totalElements,
            });
         }
      } catch (error) {
         console.error("Failed to fetch movies", error);
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      if (!isCreating) {
         fetchMovies(searchParams);
      }
   }, [isCreating, fetchMovies, searchParams]);

   const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xoá phim này?")) {
         try {
            await movieService.deleteMovie(id);
            fetchMovies(searchParams);
         } catch (err) {
            alert("Lỗi khi xoá phim");
         }
      }
   };

   return {
      movies,
      isLoading,
      searchParams,
      setSearchParams,
      pagination,
      fetchMovies,
      handleDelete,
   };
};
