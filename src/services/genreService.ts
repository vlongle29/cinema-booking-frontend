import apiService from './apiService';

const GENRE_API_PATH = '/genres';

interface GenreSearchParams {
   keyword?: string;
   page?: number;
   size?: number;
   sort?: string;
}

export const genreService = {
   /**
    * Lấy danh sách thể loại
    */
   searchGenres: (params?: GenreSearchParams) => {
      return apiService.get(`${GENRE_API_PATH}/search`, { params });
   }
};
