import React from "react";
import { Loader2 } from "lucide-react";

export const PaymentLoading: React.FC = () => {
   return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center">
         <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
         <p className="text-gray-400">Đang xác thực giao dịch...</p>
      </div>
   );
};
