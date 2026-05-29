import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import {
   MovieHero,
   RecommendedMovies,
   useMovieDetails,
} from "@/features/movie/index";
import ShowtimeSelection from "@/features/showtime/components/ShowtimeSelection";

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

   if (isLoading) return <div>Loading...</div>;
   if (!movieDetail) return <div>Movie not found</div>;

   return (
      <div className="bg-[#09090b] min-h-screen text-white">
         {/* 1. Phần thông tin phim */}
         <MovieHero
            movie={movieDetail}
            onBuyTicketClick={handleBuyTicketClick}
         />

         {/* 2. Phần chọn lịch chiếu (Feature khác) */}
         <div ref={showtimeSectionRef}>
            <ShowtimeSelection />
         </div>

         {/* 3. Phần phim đề xuất */}
         <RecommendedMovies />
      </div>
   );
}
