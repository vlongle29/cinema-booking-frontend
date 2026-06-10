import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import {
   MovieHero,
   RecommendedMovies,
   useMovieDetails,
} from "@/features/movie/index";
import ShowtimeSelection from "@/features/showtime/components/ShowtimeSelection";
import MovieReviews from "@/components/common/MovieReviews";

export default function TicketBookingDetailPage() {
   const { id: movieId } = useParams<{ id: string }>();
   const showtimeSectionRef = useRef<HTMLDivElement>(null);

   // Dùng Hook đã tách
   const { movieDetail, isLoading } = useMovieDetails(movieId);

   const handleBuyTicketClick = () => {
      if (showtimeSectionRef.current) {
         const offset = 100;
         const elementPosition =
            showtimeSectionRef.current.getBoundingClientRect().top;
         window.scrollTo({
            top: elementPosition + window.pageYOffset - offset,
            behavior: "smooth",
         });
      }
   };

   // Bọc trong container chung để tránh màn hình đen hoàn toàn khi loading
   if (isLoading) {
      return (
         <div className="bg-[#09090b] min-h-screen text-white flex items-center justify-center">
            <div className="animate-pulse text-rose-500 font-medium">
               Đang tải thông tin phim...
            </div>
         </div>
      );
   }

   if (!movieDetail) {
      return (
         <div className="bg-[#09090b] min-h-screen text-white flex items-center justify-center">
            <div className="text-gray-400">Không tìm thấy phim yêu cầu.</div>
         </div>
      );
   }

   return (
      <div className="bg-[#09090b] min-h-screen text-white animate-in fade-in duration-500">
         {/* 1. Phần thông tin phim */}
         <MovieHero
            movie={movieDetail}
            onBuyTicketClick={handleBuyTicketClick}
         />

         {/* 2. Phần chọn lịch chiếu (Feature khác) */}
         <div ref={showtimeSectionRef}>
            <ShowtimeSelection />
         </div>

         <div>
            {/* 4. Phần đánh giá (Feature khác) */}
            <MovieReviews movieId={movieId} />
         </div>

         {/* 3. Phần phim đề xuất */}
         <RecommendedMovies />
      </div>
   );
}
