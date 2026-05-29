// src/features/checkout/components/CheckoutSummary.tsx
import React from "react";
import { ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface CheckoutSummaryProps {
   timer: string;
   seatCount: number;
   ticketPrice: number;
   snackTotal: number;
   totalAmount: number;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
   timer,
   seatCount,
   ticketPrice,
   snackTotal,
   totalAmount,
}) => {
   return (
      <div className="space-y-6">
         {/* Countdown Timer */}
         <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider">
               Thời gian còn lại
            </p>
            <p className="text-4xl font-mono font-bold tracking-wider">
               {timer}
            </p>
         </div>

         {/* Booking Summary */}
         <div className="bg-[#1a1a1d] p-6 rounded-xl border border-white/10 shadow-lg">
            <h2 className="text-lg font-semibold border-b border-white/10 pb-3 mb-4 text-white">
               Tóm tắt đặt vé
            </h2>
            <div className="space-y-3 text-sm">
               <div className="flex justify-between">
                  <span className="text-gray-400">Vé ({seatCount} ghế)</span>
                  <span className="font-medium text-white">
                     {formatCurrency(ticketPrice)}
                  </span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-400">Đồ ăn & Thức uống</span>
                  <span className="font-medium text-white">
                     {formatCurrency(snackTotal)}
                  </span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-400">Giảm giá</span>
                  <span className="font-medium text-green-600">
                     - {formatCurrency(0)}
                  </span>
               </div>
               <div className="border-t border-white/5 my-3" />
               <div className="flex justify-between text-base font-bold">
                  <span className="text-white">Tổng tiền</span>
                  <span className="text-rose-600">
                     {formatCurrency(totalAmount)}
                  </span>
               </div>
            </div>
         </div>

         <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <ShieldCheck size={14} />
            <span>Thanh toán an toàn và bảo mật</span>
         </div>
      </div>
   );
};
