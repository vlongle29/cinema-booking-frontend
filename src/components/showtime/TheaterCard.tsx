import React from "react";
import type { Theater, Showtime } from "../../types/showtime";
import { MapPin, Clock } from "lucide-react";

const TheaterCard: React.FC<{
   theater: Theater;
   onShowtimeSelect: (theater: Theater, showtime: Showtime) => void;
}> = ({ theater, onShowtimeSelect }) => (
   <div className="bg-[#1a1a1e] border border-[#393939] rounded-lg p-3.5 hover:border-[#f84565] transition-colors">
      {/* Theater Header */}
      <div className="mb-3">
         <h3 className="text-white font-semibold text-base mb-0.5">
            {theater.name}
         </h3>
         <div className="flex items-center gap-1.5 text-[#797b7d] text-xs">
            <MapPin className="w-4 h-4" />
            <span>{theater.location}</span>
         </div>
      </div>

      {/* Showtimes Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
         {theater.showtimes.map((showtime) => (
            <button
               key={showtime.id}
               onClick={() => onShowtimeSelect(theater, showtime)}
               disabled={showtime.isSoldOut}
               className={`py-1.5 px-1.5 rounded-md font-medium text-xs transition-all ${
                  showtime.isSoldOut
                     ? "bg-[#252529] text-[#797b7d] cursor-not-allowed opacity-50"
                     : showtime.isPeak
                       ? "bg-[#f84565] text-white hover:bg-[#f84565]/90"
                       : "bg-[#252529] text-[#d1d5dc] border border-[#393939] hover:border-[#f84565]"
               }`}
            >
               <div className="flex flex-col items-center gap-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{showtime.time}</span>
                  {showtime.isSoldOut && (
                     <span className="text-[10px]">Sold Out</span>
                  )}
               </div>
            </button>
         ))}
      </div>

      {/* Peak Hours Note */}
      <p className="text-xs text-[#797b7d] mt-4">
         <span className="inline-block w-3 h-3 bg-[#f84565] rounded-full mr-2" />
         Peak hours (Premium pricing)
      </p>
   </div>
);

export default TheaterCard;