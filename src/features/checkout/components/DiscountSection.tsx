import React from "react";
import { ChevronDown, Ticket, Gift } from "lucide-react";

export const DiscountSection: React.FC = () => {
   return (
      <div className="lg:col-span-2 space-y-6">
         {/* Discounts & Vouchers */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between cursor-pointer">
               <div className="flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-amber-500" />
                  <h2 className="text-lg font-semibold text-slate-800">
                     Khuyến mãi & Mã giảm giá
                  </h2>
               </div>
               <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
            <div className="mt-4 flex gap-2">
               <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
               />
               <button className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition border border-amber-500">
                  Áp dụng
               </button>
            </div>
         </div>

         {/* Thẻ quà tặng */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
               <Gift className="w-6 h-6 text-amber-500" />
               <h2 className="text-lg font-semibold text-slate-800">
                  Thẻ quà tặng
               </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
               Bạn có thẻ quà tặng? Sử dụng tại đây.
            </p>
         </div>
      </div>
   );
};
