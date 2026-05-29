import React from "react";

export const SeatLegend: React.FC = () => (
   <div className="flex gap-6 mt-12 text-xs md:text-sm text-gray-400 font-medium">
      <div className="flex items-center gap-2">
         <div className="w-5 h-5 rounded-md bg-gray-800 border border-gray-700"></div>
         <span>Đã đặt</span>
      </div>
      <div className="flex items-center gap-2">
         <div className="w-5 h-5 rounded-md border-2 border-rose-500 bg-transparent"></div>
         <span>Trống</span>
      </div>
      <div className="flex items-center gap-2">
         <div className="w-5 h-5 rounded-md bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.6)]"></div>
         <span>Đang chọn</span>
      </div>
   </div>
);
