import React from "react";
import { API_BASE_URL } from "@/constants/api";
import { formatCurrency } from "@/utils/formatters";
import type { BookingListItem } from "@/types/booking";

interface Props {
   booking: BookingListItem;
}

export const BookingHistoryCard: React.FC<Props> = ({ booking: b }) => {
   return (
      <div className="flex items-center bg-slate-100/60 border border-slate-200 backdrop-blur-sm rounded-xl p-6 gap-8 shadow-md hover:shadow-lg transition-shadow">
         {/* Ảnh Phim */}
         <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img
               src={`${API_BASE_URL}${b.moviePosterUrl}`}
               alt={b.movieTitle}
               className="w-full h-full object-cover"
            />
         </div>

         {/* Thông tin */}
         <div className="flex-1">
            <div className="flex justify-between items-start">
               <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  {b.movieTitle}
               </h2>
               <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500">
                  {b.status}
               </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">
               {b.branchName} - {b.roomName} ({b.cityName})
            </p>
            <p className="text-sm text-amber-600 font-medium mb-2">
               {new Date(b.showtimeStartTime).toLocaleString("vi-VN")}
            </p>
            <div className="flex gap-6 mt-2 text-sm text-slate-500">
               <div>
                  Số vé:{" "}
                  <span className="text-slate-900 font-medium">
                     {b.ticketCount}
                  </span>
               </div>
               <div>
                  Ngày đặt:{" "}
                  <span className="text-slate-500">
                     {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                  </span>
               </div>
            </div>
         </div>

         {/* Tổng tiền */}
         <div className="text-right min-w-[80px]">
            <p className="text-2xl font-bold text-amber-600">
               {formatCurrency(b.finalAmount)}
            </p>
         </div>
      </div>
   );
};
