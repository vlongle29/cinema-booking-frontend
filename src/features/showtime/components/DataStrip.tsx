import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DateOption } from "../types/showtime.types";

interface DateStripProps {
   dates: DateOption[];
   selectedDate: string;
   onSelectDate: (date: string) => void;
   loading: boolean;
}

const DateStrip: React.FC<DateStripProps> = ({
   dates,
   selectedDate,
   onSelectDate,
   loading,
}) => {
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
      <div className="mb-6">
         <h3 className="text-base font-semibold text-slate-900 mb-3">Chọn Ngày</h3>

         <div className="flex items-center gap-4">
            {/* Left Scroll Button */}
            <button
               onClick={() => scroll("left")}
               className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
               <ChevronLeft className="w-5 h-5 text-slate-500" />
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
                             className="h-[56px] w-[56px] bg-slate-200 rounded-lg animate-pulse flex-shrink-0"
                          />
                       ))
                  : dates.map((d) => (
                       <button
                          key={d.date}
                          onClick={() => onSelectDate(d.date)}
                          className={`flex flex-col items-center justify-center w-[56px] h-[56px] rounded-lg font-medium transition-all flex-shrink-0 ${
                             selectedDate === d.date
                                ? "bg-amber-500 text-white border-2 border-amber-500 shadow-sm"
                                : "border-2 border-slate-200 bg-white text-slate-600 hover:border-amber-500 hover:text-amber-600 shadow-sm"
                          }`}
                       >
                          <span className="text-[10px] sm:text-xs">
                             {d.day}
                          </span>
                          <span className="text-base font-bold">
                             {d.dateNum}
                          </span>
                       </button>
                    ))}
            </div>

            {/* Right Scroll Button */}
            <button
               onClick={() => scroll("right")}
               className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
               <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
         </div>
      </div>
   );
};

export default DateStrip;
