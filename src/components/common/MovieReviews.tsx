import React, { useState, useEffect } from "react";
import {
   Star,
   CheckCircle2,
   EyeOff,
   ThumbsUp,
   MessageSquare,
   AlertTriangle,
} from "lucide-react";
import MyCustomRating from "../ui/MyCustomRating";
import profileIcon from "@/assets/images/profile-icon.png";
import useAuth from "../../features/auth/hooks/useAuth";
import { reviewService } from "../../services/reviewService";

interface Review {
   id: string;
   username: string;
   userAvatar: string | null;
   rating: number;
   createdAt: string;
   content: string;
   isVerified: boolean;
   isSpoiler: boolean;
   likeCount: number;
   isLikedByCurrentUser: boolean;
}

interface RatingCount {
   stars: number;
   count: number;
}

interface MovieRatingSummary {
   averageRating: number;
   totalReviews: number;
   distribution: RatingCount[];
}

interface MovieReviewsProps {
   movieId: string;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId }) => {
   const [showReviewForm, setShowReviewForm] = useState(false);
   const [revealedSpoilers, setRevealedSpoilers] = useState<string[]>([]);
   const [productRating, setProductRating] = useState<number | null>(4);
   const [comment, setComment] = useState("");
   const [isSpoiler, setIsSpoiler] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [reviewsData, setReviewsData] = useState<Review[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [summary, setSummary] = useState<MovieRatingSummary | null>(null);
   const { userInfo } = useAuth();

   const fetchReviews = async () => {
      if (!movieId) return;

      setIsLoading(true);
      try {
         const response = await reviewService.getReviewsByProduct(movieId);
         // Kiểm tra cấu trúc ApiResponse trả về từ apiService
         if (response && (response as any).data?.content) {
            setReviewsData((response as any).data.content);
         }
      } catch (error) {
         console.error("Failed to fetch reviews:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const fetchSummary = async () => {
      if (!movieId) return;
      try {
         const response = await reviewService.getMovieRatingSummary(movieId);
         if (response && (response as any).data) {
            setSummary((response as any).data);
         }
      } catch (error) {
         console.error("Failed to fetch summary:", error);
      }
   };

   useEffect(() => {
      fetchReviews();
      fetchSummary();
   }, [movieId]);

   const handleSubmitReview = async () => {
      if (!userInfo) {
         alert("Vui lòng đăng nhập để thực hiện đánh giá!");
         return;
      }
      if (!productRating) {
         alert("Vui lòng chọn số sao đánh giá!");
         return;
      }

      setIsSubmitting(true);
      try {
         await reviewService.submitReview({
            movieId,
            rating: productRating,
            content: comment,
            isSpoiler,
         });
         // Reset form và load lại dữ liệu
         setComment("");
         setIsSpoiler(false);
         setShowReviewForm(false);
         fetchReviews();
         fetchSummary(); // Cập nhật lại thống kê sau khi đánh giá mới
      } catch (error: any) {
         console.error("Submit review error detail:", error);

         // Ưu tiên lấy data từ server trả về (có thể nằm trong response.data hoặc trực tiếp ở error nếu interceptor đã bóc tách)
         const serverData = error.response?.data || error;
         const errorCode = serverData?.code || serverData?.message;

         console.log("Detected Business Error Code:", errorCode);

         if (errorCode === "TICKET_REQUIRED_FOR_REVIEW") {
            alert("Bạn chưa mua vé");
         } else if (errorCode === "REVIEW_ALREADY_EXISTS") {
            alert("Bạn đã đánh giá phim này rồi");
         } else {
            alert("Gửi đánh giá thất bại. Vui lòng thử lại!");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleToggleLike = async (reviewId: string) => {
      if (!userInfo) {
         alert("Vui lòng đăng nhập để thích bình luận!");
         return;
      }

      try {
         await reviewService.toggleLike(reviewId);
         // Cập nhật state cục bộ để UI thay đổi ngay lập tức (Optimistic Update)
         setReviewsData((prev) =>
            prev.map((r) => {
               if (r.id === reviewId) {
                  const isLiked = !r.isLikedByCurrentUser;
                  return {
                     ...r,
                     isLikedByCurrentUser: isLiked,
                     likeCount: isLiked ? r.likeCount + 1 : r.likeCount - 1,
                  };
               }
               return r;
            }),
         );
      } catch (error) {
         console.error("Failed to toggle like:", error);
      }
   };

   const toggleSpoiler = (id: string) => {
      setRevealedSpoilers((prev) =>
         prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
   };

   return (
      <div className="text-slate-900 p-6 md:p-10 font-sans">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Đánh giá & Xếp hạng</h2>

            {/* Rating Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="text-6xl font-bold text-slate-900 mb-2">
                     {summary?.averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                     <MyCustomRating
                        label=""
                        variant="read-only"
                        value={summary?.averageRating || 0}
                        size="medium"
                     />
                  </div>
                  <p className="text-slate-500 text-sm">
                     Dựa trên {summary?.totalReviews || 0} xếp hạng
                  </p>
               </div>

               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                  <div className="flex flex-col gap-3">
                     {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-4">
                           <span className="text-sm font-medium w-4">
                              {rating}
                           </span>
                           <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                 className="h-full bg-amber-400 rounded-full"
                                 style={{
                                    width: `${
                                       summary && summary.totalReviews > 0
                                          ? ((summary.distribution.find(
                                               (d) => d.stars === rating,
                                            )?.count || 0) /
                                               summary.totalReviews) *
                                            100
                                          : 0
                                    }%`,
                                 }}
                              />
                           </div>
                           <span className="text-sm text-slate-500 w-10">
                              {summary?.distribution.find(
                                 (d) => d.stars === rating,
                              )?.count || 0}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Write Review Action */}
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-semibold">
                  Đánh giá của người dùng
               </h3>
               <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
               >
                  Đánh giá
               </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
               <div className="bg-white p-6 rounded-2xl border border-amber-500/30 shadow-sm mb-10 animate-in slide-in-from-top duration-300">
                  <div className="flex flex-col gap-6">
                     <div>
                        <label className="block text-sm font-medium text-slate-500 mb-2">
                           Hãy để lại đánh giá của bạn
                        </label>

                        {/* Dùng MyCustomRating để đánh giá sao */}
                        <MyCustomRating
                           label=""
                           variant="controlled"
                           value={productRating}
                           size="large"
                           onChange={(newVal) => setProductRating(newVal)}
                        />
                     </div>

                     <div>
                        <textarea
                           placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[120px]"
                        />
                     </div>

                     <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input
                              type="checkbox"
                              checked={isSpoiler}
                              onChange={(e) => setIsSpoiler(e.target.checked)}
                              className="w-5 h-5 rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-500/50"
                           />
                           <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                              Đánh giá có tiết lộ nội dung phim
                           </span>
                        </label>
                        <button
                           onClick={handleSubmitReview}
                           disabled={isSubmitting}
                           className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isSubmitting ? "Đang gửi..." : "Bình luận"}
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
               {isLoading ? (
                  <div className="text-center py-10 text-slate-500">
                     Đang tải đánh giá...
                  </div>
               ) : reviewsData.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                     Chưa có đánh giá nào cho phim này. Hãy là người đầu tiên
                     đánh giá!
                  </div>
               ) : (
                  reviewsData.map((review) => (
                     <div
                        key={review.id}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                     >
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex gap-4">
                              <img
                                 src={review.userAvatar || profileIcon}
                                 alt={review.username}
                                 className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                              />
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-slate-900">
                                       {review.username}
                                    </span>
                                    {review.isVerified && (
                                       <span className="flex items-center gap-1 bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                                          <CheckCircle2 size={12} /> ĐÃ MUA VÉ
                                       </span>
                                    )}
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <MyCustomRating
                                       label=""
                                       variant="read-only"
                                       value={review.rating}
                                       size="small"
                                    />

                                    <span className="text-xs text-slate-500">
                                       {new Date(
                                          review.createdAt,
                                       ).toLocaleDateString("vi-VN")}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="relative">
                           {review.isSpoiler &&
                           !revealedSpoilers.includes(review.id) ? (
                              <div
                                 onClick={() => toggleSpoiler(review.id)}
                                 className="relative cursor-pointer group rounded-lg overflow-hidden"
                              >
                                 <p className="text-slate-700 leading-relaxed blur-md select-none">
                                    {review.content}
                                 </p>
                                 <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center transition-all group-hover:bg-white/60">
                                    <EyeOff
                                       className="text-slate-900 mb-2 group-hover:scale-110 transition-transform"
                                       size={24}
                                    />
                                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                       Spoiler Alert
                                    </span>
                                    <span className="text-xs text-slate-700">
                                       Click to reveal
                                    </span>
                                 </div>
                              </div>
                           ) : (
                              <p className="text-slate-700 leading-relaxed">
                                 {review.content}
                                 {review.isSpoiler && (
                                    <button
                                       onClick={() => toggleSpoiler(review.id)}
                                       className="ml-2 text-xs text-amber-600 hover:underline"
                                    >
                                       Hide
                                    </button>
                                 )}
                              </p>
                           )}
                        </div>

                        <div className="mt-4 flex items-center gap-6">
                           <button
                              onClick={() => handleToggleLike(review.id)}
                              className={`flex items-center gap-2
                              text-sm font-medium
                              border-none bg-transparent
                              p-0 outline-none
                              hover:bg-transparent
                              focus:bg-transparent
                              focus:outline-none
                              active:bg-transparent ${
                                 review.isLikedByCurrentUser
                                    ? "text-amber-600"
                                    : "text-slate-500 hover:text-amber-600"
                              }`}
                           >
                              <ThumbsUp size={18} />
                              <span>
                                 {review.likeCount == 0
                                    ? "Hữu ích ?"
                                    : review.likeCount}
                              </span>
                           </button>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {/* Show More */}
            <div className="mt-10 text-center">
               <button className="text-slate-500 hover:text-amber-600 transition-colors text-sm font-semibold flex items-center gap-2 mx-auto">
                  View All 124 Reviews
                  <Star size={14} className="animate-pulse" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default MovieReviews;
