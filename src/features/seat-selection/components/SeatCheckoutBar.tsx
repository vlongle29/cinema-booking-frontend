import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/utils";

interface Props {
   selectedSeatsSize: number;
   selectedSeatNames: string;
   onCheckout: () => void;
}

export const SeatCheckoutBar: React.FC<Props> = ({
   selectedSeatsSize,
   selectedSeatNames,
   onCheckout,
}) => (
   <div className="fixed bottom-0 left-0 w-full bg-[#0B0B0F]/90 backdrop-blur-md border-t border-gray-800 p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase">Ghế đã chọn</span>
            <span className="text-white font-bold text-lg">
               {selectedSeatsSize > 0 ? selectedSeatNames : "Chưa chọn"}
            </span>
         </div>
         <button
            onClick={onCheckout}
            disabled={selectedSeatsSize === 0}
            className={cn(
               "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300",
               selectedSeatsSize > 0
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed",
            )}
         >
            Tiếp tục thanh toán <ArrowRight className="w-5 h-5" />
         </button>
      </div>
   </div>
);
