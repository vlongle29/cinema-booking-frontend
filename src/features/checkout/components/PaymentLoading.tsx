import React from "react";
import { Loader2 } from "lucide-react";

export const PaymentLoading: React.FC = () => {
   return (
      <div className="min-h-screen bg-[#fefce8] text-slate-800 flex flex-col items-center justify-center">
         <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
         <p className="text-slate-600 font-medium">Đang xác thực giao dịch...</p>
      </div>
   );
};
