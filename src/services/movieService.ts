import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const MOVIE_API_PATH = "/movies";

interface MovieSearchParams {
   keyword?: string;
   status?: string;
   releaseDateFrom?: string;
   releaseDateTo?: string;
   page?: number;
   size?: number;
}

export const movieService = {
   /**
    * Lấy danh sách phim
    */
   getAllMovies: (params?: MovieSearchParams) => {
      return apiService.get<ApiResponse<any>>(`${MOVIE_API_PATH}/search`, {
         params,
      });
   },

   /**
    * Lấy danh sách phim đang chiếu
    */
   getMoviesNowShowing: () => {
      return apiService.get<ApiResponse<any>>(`${MOVIE_API_PATH}/now-showing`);
   },

   /**
    * Lấy danh sách phim sắp chiếu
    */
   getMoviesComingSoon: () => {
      return apiService.get<ApiResponse<any>>(`${MOVIE_API_PATH}/coming-soon`);
   },

   /**
    * Xem chi tiết phim
    */
   getMovieById: (id: string) => {
      return apiService.get<ApiResponse<any>>(`${MOVIE_API_PATH}/${id}`);
   },

   getAgeRating: () => {
      return apiService.get<ApiResponse<any>>(`${MOVIE_API_PATH}/age-ratings`);
   },

   /**
    * Thêm phim mới
    */
   createMovie: (data: any) => {
      return apiService.post<ApiResponse<any>>(MOVIE_API_PATH, data, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });
   },

   /**
    * Cập nhật thông tin phim
    */
   updateMovie: (id: string, data: FormData) => {
      return apiService.put<ApiResponse<any>>(`${MOVIE_API_PATH}/${id}`, data, {
         headers: {
            "Content-Type": "multipart/form-data",
         }
      });
   },

   /**
    * Xoá tĩnh/mềm phim
    */
   deleteMovie: (id: string) => {
      return apiService.delete<ApiResponse<any>>(`${MOVIE_API_PATH}/${id}`);
   },

   /**
    *
    * Tìm kiếm phim theo tiêu chí
    */
   searchMovies: (param: MovieSearchParams) => {
      return apiService.get<ApiResponse<any>>(`${MOVIE_API_PATH}/search`, {
         params: param,
      });
   },
};
