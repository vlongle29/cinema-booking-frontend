import React, { useState, useEffect } from "react";
import { Play, Star, Clock, Calendar, ChevronRight } from "lucide-react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import marvellogo from "@/assets/icons/marvelLogo.svg";
import { Link } from "react-router-dom";

const GENRES = ["Hành động", "Phiêu lưu", "Viễn tưởng"];

export const HeroBanner: React.FC = () => {
   const [isMuted, setIsMuted] = useState(true);
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
            {/* Multi-layer cinematic gradients */}
            <div
               className="absolute inset-0"
               style={{
                  background:
                     "linear-gradient(105deg, rgba(10,8,20,0.92) 0%, rgba(10,8,20,0.75) 40%, rgba(10,8,20,0.25) 70%, rgba(10,8,20,0.1) 100%)",
               }}
            />
            {/* Bottom fade to page bg */}
            <div
               className="absolute bottom-0 left-0 right-0 h-48"
               style={{
                  background: "linear-gradient(to bottom, transparent, #fefce8)",
               }}
            />
            {/* Subtle vignette */}
            <div
               className="absolute inset-0"
               style={{
                  background:
                     "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
               }}
            />
         </div>

         {/* ── Animated film-grain overlay ── */}
         <div
            className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
            style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
               backgroundRepeat: "repeat",
               backgroundSize: "128px",
            }}
         />

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
                  <span
                     className="relative flex h-2.5 w-2.5"
                  >
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
                  <span
                     style={{
                        WebkitTextStroke: "1px rgba(255,255,255,0.5)",
                        color: "transparent",
                     }}
                  >
                     of the Galaxy
                  </span>
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

                  {/* Mute toggle */}
                  <button
                     onClick={() => setIsMuted(!isMuted)}
                     className="rounded-full flex items-center justify-center text-white/60 hover:text-white border border-white/20 transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                     title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                  >
                     {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
                  </button>
               </div>
            </div>
         </div>

         {/* ── Scroll indicator ── */}
         <div
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
            style={{
               opacity: isVisible ? 0.5 : 0,
               transition: "opacity 1.2s ease 0.6s",
            }}
         >
            <span className="text-white text-[10px] font-semibold uppercase tracking-[0.2em]">
               Cuộn xuống
            </span>
            <div className="w-5 h-8 border border-white/40 rounded-full flex items-start justify-center p-1">
               <div
                  className="w-1 h-2 bg-white/60 rounded-full"
                  style={{ animation: "scroll-dot 1.8s ease infinite" }}
               />
            </div>
         </div>

         <style>{`
            @keyframes scroll-dot {
               0%, 100% { transform: translateY(0); opacity: 1; }
               50% { transform: translateY(8px); opacity: 0.3; }
            }
         `}</style>
      </section>
   );
};
