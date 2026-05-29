import React from "react";

export const CinemaScreen: React.FC = () => (
   <div className="mt-12 mb-8 w-full flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Chọn ghế</h1>
      <div className="relative w-full max-w-lg flex flex-col items-center">
         <div className="w-3/4 h-16 border-t-4 border-rose-900/50 rounded-[50%] shadow-[0_-10px_20px_rgba(225,29,72,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-rose-600/20 to-transparent blur-sm"></div>
         </div>
         <span className="text-gray-600 text-xs font-bold tracking-[0.2em] uppercase mt-[-40px]">
            Màn hình
         </span>
      </div>
   </div>
);
