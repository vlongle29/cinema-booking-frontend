import apiService from './apiService';

const MOVIE_API_PATH = '/movies';

interface MovieSearchParams {
   keyword?: string;
   status?: string;
   releaseDateFrom?: string;
   releaseDateTo?: string;
}

export const movieService = {
   /**
    * Lấy danh sách phim
    */
   getAllMovies: (params?: any) => {
      return apiService.get(`${MOVIE_API_PATH}/search`, { params });
   },

   /**
    * Xem chi tiết phim
    */
   getMovieById: (id: string) => {
      return apiService.get(`${MOVIE_API_PATH}/${id}`);
   },

   /**
    * Thêm phim mới
    */
   createMovie: (data: any) => {
      return apiService.post(MOVIE_API_PATH, data);
   },

   /**
    * Cập nhật thông tin phim
    */
   updateMovie: (id: string, data: any) => {
      return apiService.put(`${MOVIE_API_PATH}/${id}`, data);
   },

   /**
    * Xoá tĩnh/mềm phim
    */
   deleteMovie: (id: string) => {
      return apiService.delete(`${MOVIE_API_PATH}/${id}`);
   }
};
