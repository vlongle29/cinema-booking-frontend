import React, { useState, useEffect } from "react";
import { Play, Star, Clock, Calendar, ChevronRight } from "lucide-react";
import marvellogo from "@/assets/icons/marvelLogo.svg";
import { Link } from "react-router-dom";

const GENRES = ["Hành động", "Phiêu lưu", "Viễn tưởng"];

export const HeroBanner: React.FC = () => {
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
   }, []);

   return (
      <section className="relative w-full min-h-screen overflow-hidden flex items-center pt-16">
         {/* ── Background image with cinematic treatment ── */}
         <div className="absolute inset-0 z-0">
            <img
               src="/src/assets/images/hero-bg.jpg"
               alt="Hero Background"
               className="w-full h-full object-cover"
               style={{ transform: "scaleX(-1)" }}
            />
            {/* Multi-layer cinematic dark gradient */}
            <div
               className="absolute inset-0"
               style={{
                  background:
                     "linear-gradient(105deg, rgba(10,8,20,0.92) 0%, rgba(10,8,20,0.75) 40%, rgba(10,8,20,0.3) 70%, rgba(10,8,20,0.15) 100%)",
               }}
            />
         </div>

         {/* ── Main Content ── */}
         <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
            <div
               className="max-w-2xl"
               style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(32px)",
                  transition: "opacity 0.8s ease, transform 0.8s ease",
               }}
            >
               {/* Now Playing badge */}
               <div className="inline-flex items-center gap-2 mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                     <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">
                     Đang chiếu
                  </span>
               </div>

               {/* Brand logo */}
               <div className="mb-5 w-28">
                  <img
                     src={marvellogo}
                     alt="Marvel"
                     className="w-full h-auto object-contain brightness-0 invert opacity-90"
                  />
               </div>

               {/* Title */}
               <h1
                  className="font-outfit font-extrabold leading-none tracking-tight text-white mb-4"
                  style={{
                     fontSize: "clamp(3rem, 7vw, 5.5rem)",
                     textShadow: "0 4px 32px rgba(0,0,0,0.5)",
                  }}
               >
                  Guardians
                  <br />
                  of the Galaxy
               </h1>

               {/* Genre tags */}
               <div className="flex flex-wrap gap-2 mb-5">
                  {GENRES.map((genre) => (
                     <span
                        key={genre}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-white/20 text-white/80 backdrop-blur-sm"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                     >
                        {genre}
                     </span>
                  ))}
               </div>

               {/* Description */}
               <p className="text-sm sm:text-base leading-relaxed text-white/70 mb-8 max-w-lg">
                  Sau khi đánh cắp một quả cầu bí ẩn, Peter Quill trở thành mục tiêu săn
                  đuổi của Ronan. Để giải cứu vũ trụ, anh phải miễn cưỡng hợp tác với
                  một nhóm những kẻ lạc loài vô cùng kỳ quặc.
               </p>

               {/* Meta info row */}
               <div className="flex flex-wrap gap-5 mb-8">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                     <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                     <span className="text-white font-bold text-sm">8.0</span>
                     <span className="text-white/40 text-sm">/ 10</span>
                  </div>
                  <div className="w-px h-4 bg-white/20 self-center" />
                  <div className="flex items-center gap-1.5 text-white/70 text-sm">
                     <Calendar size={15} className="text-amber-400" />
                     <span>2018</span>
                  </div>
                  <div className="w-px h-4 bg-white/20 self-center" />
                  <div className="flex items-center gap-1.5 text-white/70 text-sm">
                     <Clock size={15} className="text-amber-400" />
                     <span>2h 08m</span>
                  </div>
               </div>

               {/* CTA Buttons */}
               <div className="flex items-center gap-3 flex-wrap">
                  <Link
                     to="/movies"
                     className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white overflow-hidden no-underline"
                     style={{
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                        boxShadow: "0 8px 32px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
                     }}
                  >
                     <span className="relative z-10">Mua vé ngay</span>
                     <ChevronRight
                        size={16}
                        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                     />
                     {/* Hover shimmer */}
                     <div
                        className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                        style={{
                           background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        }}
                     />
                  </Link>

                  <button
                     className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white border border-white/25 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                     style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                     <div
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                     >
                        <Play size={12} fill="white" />
                     </div>
                     Xem Trailer
                  </button>
               </div>
            </div>
         </div>
      </section>
   );
};
