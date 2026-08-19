// src/features/checkout/components/CheckoutFooter.tsx
import React from "react";
import { cn } from "@/utils/utils";
import { formatCurrency } from "@/utils/formatters";

const MOCK_MOVIE_DETAILS = {
   title: "Phi Vụ Động Trời 2",
   cinema: "CGV Aeon Tân Phú",
   hall: "Cinema 6",
   image: "http://localhost:3845/assets/1b26250be4903592d678845efae190b5f9bb5ea4.png",
};

interface CheckoutFooterProps {
   seats: string[];
   totalAmount: number;
   isProcessing: boolean;
   onBack: () => void;
   onPayment: () => void;
}

export const CheckoutFooter: React.FC<CheckoutFooterProps> = ({
   seats,
   totalAmount,
   isProcessing,
   onBack,
   onPayment,
}) => {
   return (
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg p-4 z-50">
         <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Nút quay lại */}
            <button
               onClick={onBack}
               className="px-6 py-3 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors hidden md:block"
            >
               Quay lại
            </button>

            {/* Thông tin phim thu gọn */}
            <div className="flex items-center gap-4 flex-grow">
               <img
                  src={MOCK_MOVIE_DETAILS.image}
                  alt={MOCK_MOVIE_DETAILS.title}
                  className="w-12 h-16 object-cover rounded-md hidden sm:block"
               />
               <div className="text-slate-800">
                  <h3 className="font-bold text-sm md:text-base">
                     {MOCK_MOVIE_DETAILS.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                     {MOCK_MOVIE_DETAILS.cinema} • {MOCK_MOVIE_DETAILS.hall} •
                     Ghế: {seats.join(", ")}
                  </p>
               </div>
            </div>

            {/* Hành động thanh toán */}
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <span className="text-slate-400 text-xs uppercase tracking-wider">Tổng</span>
                  <p className="text-slate-800 font-bold text-xl">
                     {formatCurrency(totalAmount)}
                  </p>
               </div>
               <button
                  onClick={onPayment}
                  disabled={isProcessing}
                  className={cn(
                     "flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-400/30 hover:scale-105 active:scale-95 transition-all duration-300",
                     isProcessing && "opacity-70 cursor-not-allowed",
                  )}
               >
                  {isProcessing ? (
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ĐANG XỬ LÝ...
                     </div>
                  ) : (
                     "THANH TOÁN"
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};
