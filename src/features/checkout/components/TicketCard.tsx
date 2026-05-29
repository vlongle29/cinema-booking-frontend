import React from "react";
import { Calendar, Ticket, MapPin } from "lucide-react";
import { API_BASE_URL } from "@/constants/api";
import { formatCurrency } from "@/utils/formatters"; // Sử dụng formatCurrency chung

interface TicketCardProps {
   showtimeData: any;
   bookingData: any;
   transactionNo: string | null;
   bookingId: string;
   amount: string | null;
}

export const TicketCard: React.FC<TicketCardProps> = ({
   showtimeData,
   bookingData,
   transactionNo,
   bookingId,
   amount,
}) => {
   // Xử lý format tiền tệ dành riêng cho VNPAY (chia 100)
   const displayAmount = amount ? Number(amount) / 100 : 0;

   return (
      <div className="bg-[#1a1a1d] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
         <div className="p-8 border-b border-dashed border-white/20 relative">
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#0B0B0F] rounded-full border border-white/10"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#0B0B0F] rounded-full border border-white/10"></div>

            <div className="flex flex-col md:flex-row gap-6">
               <div className="w-full md:w-32 h-44 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                  <img
                     src={
                        showtimeData?.movie?.posterUrl
                           ? `${API_BASE_URL}${showtimeData.movie.posterUrl}`
                           : "https://via.placeholder.com/150x220?text=No+Image"
                     }
                     alt="Movie Poster"
                     className="w-full h-full object-cover"
                  />
               </div>
               <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-white">
                     {showtimeData?.movie?.title || "Tên phim"}
                  </h2>
                  <div className="grid grid-cols-2 gap-y-5 text-sm">
                     <div className="space-y-1">
                        <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                           Ngày & Giờ chiếu
                        </span>
                        <div className="flex items-center gap-2 text-gray-200 font-medium">
                           <Calendar size={14} className="text-rose-500" />
                           <span>
                              {showtimeData?.startTime
                                 ? new Date(
                                      showtimeData.startTime,
                                   ).toLocaleString("vi-VN")
                                 : "Không có"}
                           </span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                           Ghế
                        </span>
                        <div className="flex items-center gap-2 text-gray-200 font-medium">
                           <Ticket size={14} className="text-rose-500" />
                           <span className="font-bold">
                              {bookingData?.tickets
                                 ?.map((t: any) => t.seatNumber)
                                 .join(", ") || "Không có"}
                           </span>
                        </div>
                     </div>
                     <div className="col-span-2 space-y-1">
                        <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                           Rạp chiếu
                        </span>
                        <div className="flex items-center gap-2 text-gray-200 font-medium">
                           <MapPin size={14} className="text-rose-500" />
                           <span>
                              {showtimeData?.branchName || "Chi nhánh"} •{" "}
                              {showtimeData?.roomName || "Room"}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="p-8 bg-white/[0.02]">
            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Mã giao dịch</span>
                  <span className="font-mono text-gray-300">
                     {transactionNo || "Không có"}
                  </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Mã đặt vé</span>
                  <span className="text-gray-300 font-semibold">
                     #{bookingId || "Không có"}
                  </span>
               </div>
               <div className="border-t border-white/5 my-2"></div>
               <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-200">
                     Tổng thanh toán
                  </span>
                  <span className="text-3xl font-bold text-rose-500">
                     {formatCurrency(displayAmount)}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
};
