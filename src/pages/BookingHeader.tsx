import React, { useState, useEffect } from "react";

export interface BookingInfo {
   movie: { title: string; format: string };
   cinema: string;
   screen: string;
   date: string;
   time: string;
   seats: string[];
   countdown: number;
}

interface BookingHeaderProps {
   data: BookingInfo;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ data }) => {
   const [timeLeft, setTimeLeft] = useState(data.countdown);

   useEffect(() => {
      if (timeLeft <= 0) return;
      const timer = setInterval(() => {
         setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
   }, [timeLeft]);

   const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, "0")}:${s
         .toString()
         .padStart(2, "0")}`;
   };

   return (
      <div className="max-w-6xl mx-auto mb-8 bg-[#1a1a1d] p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg animate-[fadeIn_0.5s_ease-out]">
         <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">
               {data.movie.title}
            </h2>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
               <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                     <span className="px-2 py-0.5 rounded bg-white/10 text-white text-xs font-bold border border-white/10">
                        {data.movie.format}
                     </span>
                     <span className="text-gray-300">{data.cinema}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                     <span className="text-gray-300">{data.screen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                     <span className="text-gray-300">
                        {data.seats.length} Ghế:{" "}
                        <span className="text-white font-bold">
                           {data.seats.join(", ")}
                        </span>
                     </span>
                  </div>
               </div>
               <div className="text-rose-400 font-medium flex items-center gap-2">
                  <span>{data.date}</span>
                  <span>•</span>
                  <span>{data.time}</span>
               </div>
            </div>
         </div>

         <div className="flex flex-col items-end bg-[#0B0B0F] px-6 py-3 rounded-lg border border-white/5 min-w-[160px]">
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">
               Time Remaining
            </span>
            <span className="text-3xl font-mono font-bold text-rose-500 tracking-wider">
               {formatTime(timeLeft)}
            </span>
         </div>
      </div>
   );
};

export default BookingHeader;
