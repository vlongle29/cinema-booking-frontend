import React from "react";
import {
   HeroBanner,
   NowShowingSection,
   TrailerGallery,
} from "@/features/movie";

const HomePage: React.FC = () => {
   return (
      <div className="w-full bg-dark-bg overflow-x-hidden">
         {/* 1. Phần Hero tĩnh */}
         <HeroBanner />

         {/* 2. Phần Danh sách phim (Đã tự động fetch data bên trong) */}
         <NowShowingSection />

         {/* 3. Phần Video Trailers */}
         <TrailerGallery />
      </div>
   );
};

export default HomePage;
