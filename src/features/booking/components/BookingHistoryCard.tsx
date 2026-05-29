import React from "react";
import { API_BASE_URL } from "@/constants/api";
import { formatCurrency } from "@/utils/formatters";
import type { BookingListItem } from "@/types/booking";

interface Props {
   booking: BookingListItem;
}

export const BookingHistoryCard: React.FC<Props> = ({ booking: b }) => {
   return (
      <div className="flex items-center bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)] rounded-lg p-6 gap-8">
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
               <h2 className="text-xl font-semibold text-white mb-2">
                  {b.movieTitle}
               </h2>
               <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500">
                  {b.status}
               </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">
               {b.branchName} - {b.roomName} ({b.cityName})
            </p>
            <p className="text-sm text-[#f84565] mb-2">
               {new Date(b.showtimeStartTime).toLocaleString("vi-VN")}
            </p>
            <div className="flex gap-6 mt-2 text-sm text-gray-400">
               <div>
                  Số vé:{" "}
                  <span className="text-white font-medium">
                     {b.ticketCount}
                  </span>
               </div>
               <div>
                  Ngày đặt:{" "}
                  <span className="text-gray-500">
                     {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                  </span>
               </div>
            </div>
         </div>

         {/* Tổng tiền */}
         <div className="text-right min-w-[80px]">
            <p className="text-2xl font-bold text-white">
               {formatCurrency(b.finalAmount)}
            </p>
         </div>
      </div>
   );
};
