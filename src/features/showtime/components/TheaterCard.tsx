import React from "react";
import type { Theater, Showtime } from "../../types/showtime";
import { MapPin, Clock, Layout } from "lucide-react";

const TheaterCard: React.FC<{
   theater: Theater;
   onShowtimeSelect: (theater: Theater, showtime: Showtime) => void;
}> = ({ theater, onShowtimeSelect }) => {
   // Nhóm suất chiếu theo tên phòng
   const groupedShowtimes = theater.showtimes.reduce(
      (acc: Record<string, Showtime[]>, showtime: Showtime) => {
         const roomName = (showtime as any).roomName || "Phòng chiếu";
         if (!acc[roomName]) acc[roomName] = [];
         acc[roomName].push(showtime);
         return acc;
      },
      {} as Record<string, Showtime[]>,
   );

   return (
      <div className="bg-[#1a1a1e] border border-[#393939] rounded-lg p-4 hover:border-[#f84565]/50 transition-colors">
         {/* Theater Header */}
         <div className="mb-5 border-b border-[#393939] pb-3">
            <h3 className="text-white font-bold text-lg mb-1">
               {theater.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[#797b7d] text-xs">
               <MapPin className="w-3.5 h-3.5" />
               <span>{theater.location}</span>
            </div>
         </div>

         {/* Room Groups */}
         <div className="space-y-6">
            {Object.entries(groupedShowtimes).map(([roomName, showtimes]) => (
               <div key={roomName}>
                  <div className="flex items-center gap-2 mb-3 text-[#f84565]">
                     <Layout className="w-4 h-4" />
                     <span className="text-sm font-medium uppercase tracking-wider">
                        {roomName}
                     </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                     {showtimes.map((showtime) => (
                        <button
                           key={showtime.id}
                           onClick={() => onShowtimeSelect(theater, showtime)}
                           disabled={showtime.isSoldOut}
                           className={`py-2 px-1 rounded-md font-semibold text-xs transition-all border ${
                              showtime.isSoldOut
                                 ? "bg-[#252529] text-[#555] border-transparent cursor-not-allowed"
                                 : showtime.isPeak
                                   ? "bg-[#f84565] text-white border-[#f84565] hover:bg-[#d63a56]"
                                   : "bg-[#252529] text-[#d1d5dc] border-[#393939] hover:border-[#f84565]"
                           }`}
                        >
                           <div className="flex flex-col items-center gap-1">
                              <span className="text-[13px]">
                                 {showtime.time}
                              </span>
                              {showtime.isSoldOut && (
                                 <span className="text-[9px] uppercase">
                                    Hết vé
                                 </span>
                              )}
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>

         {/* Peak Hours Note */}
         <div className="mt-6 pt-4 border-t border-[#393939]/50 flex items-center gap-4">
            <p className="text-[11px] text-[#797b7d] flex items-center">
               <span className="inline-block w-2.5 h-2.5 bg-[#f84565] rounded-full mr-2" />
               Suất chiếu cao điểm
            </p>
            <p className="text-[11px] text-[#797b7d] flex items-center">
               <span className="inline-block w-2.5 h-2.5 bg-[#252529] border border-[#393939] rounded-full mr-2" />
               Suất chiếu thường
            </p>
         </div>
      </div>
   );
};

export default TheaterCard;
