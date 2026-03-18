import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DateOption } from "../../types/showtime";

interface DateStripProps {
   dates: DateOption[];
   selectedDate: string;
   onSelectDate: (date: string) => void;
   loading: boolean;
}

const DateStrip: React.FC<DateStripProps> = ({ dates, selectedDate, onSelectDate, loading }) => {
   const [scrollPos, setScrollPos] = useState(0);
   const containerRef = React.useRef<HTMLDivElement>(null);

   const scroll = (direction: "left" | "right") => {
      if (containerRef.current) {
         const amount = 300;
         containerRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
         });
      }
   };

   return (
      <div className="mb-4">
         <h3 className="text-base font-semibold text-white mb-3">Choose Date</h3>

         <div className="flex items-center gap-4">
            {/* Left Scroll Button */}
            <button
               onClick={() => scroll("left")}
               className="p-2 hover:bg-[#1a1a1e] rounded-lg transition-colors flex-shrink-0"
            >
               <ChevronLeft className="w-5 h-5 text-[#d1d5dc]" />
            </button>

            {/* Dates Container */}
            <div
               ref={containerRef}
               className="flex gap-2.5 overflow-x-auto flex-1 pb-2 scrollbar-hide"
            >
               {loading
                  ? Array(7)
                       .fill(0)
                       .map((_, i) => (
                          <div
                             key={i}
                             className="h-[56px] w-[56px] bg-[#252529] rounded-lg animate-pulse flex-shrink-0"
                          />
                       ))
                  : dates.map((d) => (
                       <button
                          key={d.date}
                          onClick={() => onSelectDate(d.date)}
                          className={`flex flex-col items-center justify-center w-[56px] h-[56px] rounded-lg font-medium transition-all flex-shrink-0 ${
                             selectedDate === d.date
                                ? "bg-[#f84565] text-white border-2 border-[#f84565]"
                                : "border-2 border-[#393939] text-[#d1d5dc] hover:border-[#f84565]"
                          }`}
                       >
                          <span className="text-[10px] sm:text-xs">{d.day}</span>
                          <span className="text-base font-bold">{d.dateNum}</span>
                       </button>
                    ))}
            </div>

            {/* Right Scroll Button */}
            <button
               onClick={() => scroll("right")}
               className="p-2 hover:bg-[#1a1a1e] rounded-lg transition-colors flex-shrink-0"
            >
               <ChevronRight className="w-5 h-5 text-[#d1d5dc]" />
            </button>
         </div>
      </div>
   );
};

export default DateStrip;
