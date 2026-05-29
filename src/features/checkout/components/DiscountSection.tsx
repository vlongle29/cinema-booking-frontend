import React from "react";
import { ChevronDown, Ticket, Gift } from "lucide-react";

export const DiscountSection: React.FC = () => {
   return (
      <div className="lg:col-span-2 space-y-6">
         {/* Discounts & Vouchers */}
         <div className="bg-[#1a1a1d] p-6 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between cursor-pointer">
               <div className="flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-rose-500" />
                  <h2 className="text-lg font-semibold text-white">
                     Khuyến mãi & Mã giảm giá
                  </h2>
               </div>
               <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
            <div className="mt-4 flex gap-2">
               <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="flex-grow px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
               />
               <button className="px-6 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border border-white/5">
                  Áp dụng
               </button>
            </div>
         </div>

         {/* Thẻ quà tặng */}
         <div className="bg-[#1a1a1d] p-6 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
               <Gift className="w-6 h-6 text-rose-500" />
               <h2 className="text-lg font-semibold text-white">
                  Thẻ quà tặng
               </h2>
            </div>
            <p className="text-sm text-gray-400 mt-1">
               Bạn có thẻ quà tặng? Sử dụng tại đây.
            </p>
         </div>
      </div>
   );
};
