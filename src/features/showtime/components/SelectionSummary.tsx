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
      <div className="mt-6 p-4 bg-amber-500/10 border-2 border-amber-500 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
         <h3 className="text-slate-900 font-semibold text-sm mb-3 uppercase tracking-wider">
            Thông tin vé đã chọn
         </h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div>
               <p className="text-slate-500 text-[10px] font-bold uppercase">
                  Ngày
               </p>
               <p className="text-slate-900 font-semibold truncate">
                  {selectedDate}
               </p>
            </div>
            <div>
               <p className="text-slate-500 text-[10px] font-bold uppercase">
                  Thành phố
               </p>
               <p className="text-slate-900 font-semibold truncate">{cityName}</p>
            </div>
            <div>
               <p className="text-slate-500 text-[10px] font-bold uppercase">
                  Định dạng
               </p>
               <p className="text-slate-900 font-semibold truncate">{formatName}</p>
            </div>
            <div>
               <p className="text-slate-500 text-[10px] font-bold uppercase">
                  Rạp & Thời gian
               </p>
               <p className="text-slate-900 font-semibold truncate">
                  {theaterName} -{" "}
                  <span className="text-amber-600">{showtime}</span>
               </p>
            </div>
         </div>

         <button
            onClick={onProceed}
            className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/30"
         >
            Tiếp tục chọn ghế
         </button>
      </div>
   );
};

export default SelectionSummary;
