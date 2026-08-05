import React from "react";
import { Calendar, Clock, ArrowRight, Play } from "lucide-react";
import marvellogo from "@/assets/icons/marvelLogo.svg";

export const HeroBanner: React.FC = () => {
   return (
      <section className="relative w-full min-h-[90vh] overflow-hidden flex items-center justify-start pt-16">
         <div className="absolute inset-0 z-0">
            <img
               src="/src/assets/images/hero-bg.jpg"
               alt="Hero Background"
               className="w-full h-full object-cover"
               style={{ transform: "scaleX(-1)", filter: "brightness(1.15)" }}
            />
            {/* Gradient mask blending to the yellow background at the bottom and white on the left */}
            <div
               className="absolute inset-0 z-10"
               style={{
                  background:
                     "linear-gradient(to right, rgba(254,252,232,0.95) 0%, rgba(254,252,232,0.4) 50%, rgba(254,252,232,0) 100%), linear-gradient(to bottom, rgba(254,252,232,0) 60%, rgba(254,252,232,1) 100%)",
               }}
            ></div>
         </div>

         <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-4">
            <div className="max-w-xl bg-white/50 backdrop-blur-md border border-white/60 p-8 sm:p-10 rounded-3xl shadow-xl animate-in slide-in-from-bottom-8 duration-700">
               <div className="w-24 sm:w-32 mb-4">
                  <img
                     src={marvellogo}
                     alt="Marvel"
                     className="w-full h-auto object-contain brightness-0 opacity-80"
                  />
               </div>

               <h1 className="text-4xl sm:text-5xl md:text-6xl font-outfit font-extrabold leading-tight mb-3 text-slate-900 tracking-tight">
                  Guardians <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>of the Galaxy
               </h1>

               <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                     Phổ biến
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-700">
                     Hành động | Phiêu lưu | Viễn tưởng
                  </p>
               </div>

               <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-700 mb-6">
                  Sau khi đánh cắp một quả cầu bí ẩn, Peter Quill trở thành mục tiêu săn đuổi của Ronan. Để giải cứu vũ trụ, anh phải miễn cưỡng hợp tác với một nhóm những kẻ lạc loài vô cùng kỳ quặc.
               </p>

               <div className="flex flex-wrap gap-4 sm:gap-6 mb-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                     <Calendar size={18} className="text-amber-500" /> <span>2018</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                     <Clock size={18} className="text-amber-500" /> <span>2h 8m</span>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <button className="group flex items-center justify-center gap-2 px-6 py-3 w-fit rounded-full text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-[0_8px_20px_rgba(245,158,11,0.3)] hover:-translate-y-1">
                     Mua vé ngay <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <button className="group flex items-center justify-center gap-2 px-6 py-3 w-fit rounded-full text-sm font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-all shadow-sm hover:-translate-y-1">
                     <Play size={18} className="text-amber-500" /> Xem Trailer
                  </button>
               </div>
            </div>
         </div>
      </section>
   );
};
