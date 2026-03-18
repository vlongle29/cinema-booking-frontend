import React from "react";

interface SelectionSummaryProps {
   selectedDate: string | undefined;
   cityName: string | undefined;
   formatName: string | undefined;
   theaterName: string;
   showtime: string;
   onProceed: () => void;
}

const SelectionSummary: React.FC<SelectionSummaryProps> = ({
   selectedDate,
   cityName,
   formatName,
   theaterName,
   showtime,
   onProceed,
}) => {
   return (
      <div className="mt-6 p-4 bg-[#f84565]/10 border-2 border-[#f84565] rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
         <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
            Your Selection
         </h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div>
               <p className="text-[#797b7d] text-[10px] font-bold uppercase">Date</p>
               <p className="text-white font-semibold truncate">{selectedDate}</p>
            </div>
            <div>
               <p className="text-[#797b7d] text-[10px] font-bold uppercase">City</p>
               <p className="text-white font-semibold truncate">{cityName}</p>
            </div>
            <div>
               <p className="text-[#797b7d] text-[10px] font-bold uppercase">Format</p>
               <p className="text-white font-semibold truncate">{formatName}</p>
            </div>
            <div>
               <p className="text-[#797b7d] text-[10px] font-bold uppercase">Theater & Time</p>
               <p className="text-white font-semibold truncate">
                  {theaterName} - <span className="text-[#f84565]">{showtime}</span>
               </p>
            </div>
         </div>

         <button
            onClick={onProceed}
            className="mt-6 w-full bg-[#f84565] hover:bg-[#f84565]/90 text-white font-bold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#f84565]/20"
         >
            Proceed to Seat Selection
         </button>
      </div>
   );
};

export default SelectionSummary;
