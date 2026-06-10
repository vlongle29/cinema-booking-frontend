import apiService from "./apiService";
import type { ApiResponse } from "./apiService";

const REVIEW_API_PATH = "/reviews";

export const reviewService = {
   /**
    * Gửi đánh giá cho một sản phẩm
    */
   submitReview: (data: any) => {
      return apiService.post(`${REVIEW_API_PATH}`, {
         ...data,
      });
   },

   /**
    * Lấy danh sách đánh giá cho một sản phẩm
    */
   getReviewsByProduct: (movieId: string) => {
      return apiService.get(`${REVIEW_API_PATH}/movie/${movieId}`);
   },

   /**
    * Thích hoặc bỏ thích một đánh giá (Toggle)
    */
   toggleLike: (reviewId: string) => {
      return apiService.post(`${REVIEW_API_PATH}/${reviewId}/like`);
   },

   /**
    * Thống kê số lượng đánh giá và điểm trung bình cho một sản phẩm
    */
   getMovieRatingSummary: (movieId: string) => {
      return apiService.get(`${REVIEW_API_PATH}/movie/${movieId}/summary`);
   },
};
