import React, { useState } from "react";
import { Star, Calendar, Clock, ArrowRight } from "lucide-react";
import marvellogo from "../assets/icons/marvelLogo.svg";
import MovieCard from "../features/movie/conponents/MovieCard";
import type { Movie } from "../features/movie/types";

// 1. Giả lập dữ liệu từ API (Sau này bạn gọi từ Spring Boot về)
const videoData = [
   { id: "WpW36ldAqnM", title: "Ironheart Official Trailer" },
   { id: "-sAOWhvheK8", title: "Thunderbolts* Final Trailer" },
   { id: "1pHDWnXmK7Y", title: "Captain America: BNW" },
   { id: "umiKiW4En9g", title: "What If...? Season 3" },
];

// Sample movie data
const nowShowingMovies: Movie[] = [
   {
      id: 1,
      title: "Guardians of the Galaxy",
      genre: "Action | Adventure | Sci-Fi",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/guardians.jpg",
   },
   {
      id: 2,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita1.jpg",
   },
   {
      id: 3,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita2.jpg",
   },
   {
      id: 4,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita3.jpg",
   },
];

const moreMovies: Movie[] = [
   {
      id: 5,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita4.jpg",
   },
   {
      id: 6,
      title: "Alita Battle Angel",
      genre: "Action, Adventure",
      year: "2018",
      duration: "2h 8m",
      rating: 4.5,
      image: "/images/alita5.jpg",
   },
];

const HomePage: React.FC = () => {
   // 2. State lưu video đang được chọn (mặc định lấy video đầu tiên)
   const [currentVideo, setCurrentVideo] = useState(videoData[0]);

   return (
      <div className="w-full bg-dark-bg overflow-x-hidden">
         {/* Hero Section */}
         <section className="relative w-full h-[785px] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0">
               <img
                  src="/src/assets/images/hero-bg.jpg"
                  alt="Hero Background"
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)", filter: "brightness(1.7)" }}
               />
               <div
                  className="absolute inset-0 z-10"
                  style={{
                     background:
                        "linear-gradient(89deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.66) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.4) 100%)",
                  }}
               ></div>
            </div>

            <div className="relative z-10 max-w-7xl w-full px-10 pt-[72px] flex flex-col gap-5">
               <div className="w-[173px] h-[39px] mb-5">
                  <img
                     src={marvellogo}
                     alt="Marvel"
                     className="w-full h-full object-contain"
                  />
               </div>

               <h1 className="text-7xl font-outfit font-semibold leading-tight mb-5 max-w-[740px] text-white">
                  Guardians
                  <br />
                  of the Galaxy
               </h1>

               <p className="text-base font-medium text-secondary mb-2.5">
                  Action | Adventure | Sci-Fi
               </p>

               <p className="text-base font-normal leading-loose text-[#ebf3ff] max-w-[449px] mb-5">
                  In a post-apocalyptic world where cities ride on wheels and
                  consume each other to survive, two people meet in London and
                  try to stop a conspiracy.
               </p>

               <div className="flex gap-6 mb-8">
                  <div className="flex items-center gap-2 text-base font-medium text-secondary">
                     <Calendar size={18} />
                     <span>2018</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium text-secondary">
                     <Clock size={18} />
                     <span>2h 8m</span>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold bg-primary text-white transition-all duration-300 hover:bg-[#ff5580] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(248,69,101,0.4)]">
                     Explore Movies
                     <ArrowRight size={18} />
                  </button>
               </div>
            </div>
         </section>

         {/* Now Showing Section */}
         <section className="max-w-7xl mx-auto py-[60px] px-10">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-xl font-bold text-secondary">Now Showing</h2>
               <a
                  href="#view-all"
                  className="flex items-center gap-2 text-sm font-medium text-[#99a1af] no-underline transition-all duration-300 hover:text-primary hover:gap-3"
               >
                  View All <ArrowRight size={16} />
               </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
               {nowShowingMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
               ))}
            </div>

            <div className="flex justify-center mt-10">
               <button className="px-6 py-3 bg-primary text-white rounded rounded-md text-sm font-semibold transition-all duration-300 hover:bg-[#ff5580] hover:-translate-y-0.5">
                  Show more
               </button>
            </div>
         </section>

         {/* Trailers Section */}
         <section className="w-full py-[60px] px-10 bg-dark-bg">
            <div className="max-w-[1000px] mx-auto">
               <div className="text-base font-bold text-secondary mb-5">
                  Trailers
               </div>
               <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-5 text-white">
                  {/* --- PHẦN 1: VIDEO PLAYER CHÍNH --- */}
                  <div className="relative w-full pb-[56.25%] bg-black rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                     <iframe
                        src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                        title={currentVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full border-none"
                     ></iframe>
                  </div>

                  {/* --- PHẦN 2: DANH SÁCH THUMBNAIL --- */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.75">
                     {videoData.map((video) => (
                        <div
                           key={video.id}
                           className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 relative border-2 border-transparent bg-[#1a1c21] hover:scale-105 ${
                              video.id === currentVideo.id
                                 ? "scale-105 border-primary"
                                 : ""
                           }`}
                           onClick={() => setCurrentVideo(video)}
                        >
                           <img
                              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                              alt={video.title}
                              className={`w-full h-[140px] object-cover block transition-opacity duration-300 ${
                                 video.id === currentVideo.id
                                    ? "opacity-100"
                                    : "opacity-70"
                              } hover:opacity-100`}
                           />
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center border-2 border-white pointer-events-none">
                              <div
                                 className="absolute w-0 h-0"
                                 style={{
                                    borderLeft: "14px solid white",
                                    borderTop: "8px solid transparent",
                                    borderBottom: "8px solid transparent",
                                    marginLeft: "4px",
                                 }}
                              ></div>
                           </div>
                           <div className="p-2.5 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                              {video.title}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
};

export default HomePage;
