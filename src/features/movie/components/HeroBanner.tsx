import React from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import marvellogo from "@/assets/icons/marvelLogo.svg";

export const HeroBanner: React.FC = () => {
   return (
      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
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

         <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 flex flex-col gap-4">
            <div className="w-32 sm:w-40 md:w-44 mb-2 sm:mb-4">
               <img
                  src={marvellogo}
                  alt="Marvel"
                  className="w-full h-auto object-contain"
               />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-outfit font-semibold leading-tight mb-2 text-white">
               Guardians <br className="hidden sm:block" />
               <span className="sm:hidden"> </span>of the Galaxy
            </h1>

            <p className="text-sm sm:text-base font-medium text-secondary mb-1">
               Action | Adventure | Sci-Fi
            </p>

            <p className="text-sm sm:text-base font-normal leading-relaxed text-[#ebf3ff] max-w-xl mb-4">
               In a post-apocalyptic world where cities ride on wheels and
               consume each other to survive...
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
               <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  <Calendar size={18} /> <span>2018</span>
               </div>
               <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  <Clock size={18} /> <span>2h 8m</span>
               </div>
            </div>

            <button className="flex items-center justify-center gap-2 px-5 py-2.5 w-fit rounded-full text-sm font-semibold bg-primary text-white hover:bg-[#ff5580] transition-all">
               Khám phá Phim <ArrowRight size={18} />
            </button>
         </div>
      </section>
   );
};
