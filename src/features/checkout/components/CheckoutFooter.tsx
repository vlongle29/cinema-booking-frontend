// src/features/checkout/components/CheckoutFooter.tsx
import React from "react";
import { cn } from "@/utils/utils";
import { formatCurrency } from "@/utils/formatters";

const MOCK_MOVIE_DETAILS = {
   title: "Phi Vụ Động Trời 2",
   cinema: "CGV Aeon Tân Phú",
   hall: "Cinema 6",
   image: "http://localhost:3845/assets/1b26250be4903592d678845efae190b5f9bb5ea4.png", // Bạn có thể thay bằng dynamic props sau này
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
      <div className="fixed bottom-0 left-0 w-full bg-[#0B0B0F]/95 backdrop-blur-sm border-t border-gray-800 p-4 z-50">
         <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Nút quay lại */}
            <button
               onClick={onBack}
               className="px-6 py-3 rounded-lg font-semibold text-white hover:bg-white/10 transition-colors hidden md:block"
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
               <div className="text-white">
                  <h3 className="font-bold text-sm md:text-base">
                     {MOCK_MOVIE_DETAILS.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                     {MOCK_MOVIE_DETAILS.cinema} • {MOCK_MOVIE_DETAILS.hall} •
                     Ghế: {seats.join(", ")}
                  </p>
               </div>
            </div>

            {/* Hành động thanh toán */}
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <span className="text-gray-400 text-xs uppercase">Tổng</span>
                  <p className="text-white font-bold text-xl">
                     {formatCurrency(totalAmount)}
                  </p>
               </div>
               <button
                  onClick={onPayment}
                  disabled={isProcessing}
                  className={cn(
                     "flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all duration-300",
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
