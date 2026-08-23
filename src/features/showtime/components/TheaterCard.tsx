import React from "react";
import type { Theater, Showtime } from "../types/showtime.types";
import { MapPin, Layout } from "lucide-react";

const TheaterCard: React.FC<{
   theater: Theater;
   selectedShowtimeId?: string;
   onShowtimeSelect: (theater: Theater, showtime: Showtime) => void;
}> = ({ theater, selectedShowtimeId, onShowtimeSelect }) => {
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
      <div className="bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-500/50 transition-colors shadow-sm">
         {/* Theater Header */}
         <div className="mb-5 border-b border-slate-200 pb-3">
            <h3 className="text-slate-900 font-bold text-lg mb-1">
               {theater.name}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
               <MapPin className="w-3.5 h-3.5" />
               <span>{theater.location}</span>
            </div>
         </div>

         {/* Room Groups */}
         <div className="space-y-6">
            {Object.entries(groupedShowtimes).map(([roomName, showtimes]) => (
               <div key={roomName}>
                  <div className="flex items-center gap-2 mb-3 text-amber-600">
                     <Layout className="w-4 h-4" />
                     <span className="text-sm font-medium uppercase tracking-wider">
                        {roomName}
                     </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                     {(showtimes as Showtime[]).map((showtime: Showtime) => {
                        const isSelected = showtime.id === selectedShowtimeId;

                        return (
                           <button
                              key={showtime.id}
                              onClick={() => onShowtimeSelect(theater, showtime)}
                              disabled={showtime.isSoldOut}
                              className={`py-2 px-1 rounded-md font-semibold text-xs transition-colors border ${
                                 showtime.isSoldOut
                                    ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                                    : isSelected
                                      ? "bg-slate-900 text-white border-slate-900 font-bold"
                                      : showtime.isPeak
                                        ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
                                        : "bg-white text-slate-700 border-slate-200 hover:border-amber-500 hover:text-amber-600 shadow-sm"
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
                        );
                     })}
                  </div>
               </div>
            ))}
         </div>

         {/* Peak Hours Note */}
         <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-4">
            <p className="text-[11px] text-slate-500 flex items-center">
               <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full mr-2" />
               Suất chiếu cao điểm
            </p>
            <p className="text-[11px] text-slate-500 flex items-center">
               <span className="inline-block w-2.5 h-2.5 bg-white border border-slate-300 rounded-full mr-2" />
               Suất chiếu thường
            </p>
         </div>
      </div>
   );
};

export default TheaterCard;
