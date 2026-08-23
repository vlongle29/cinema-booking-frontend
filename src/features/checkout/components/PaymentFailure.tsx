import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PaymentFailure: React.FC = () => {
   const navigate = useNavigate();
   return (
      <div className="min-h-screen bg-[#fefce8] text-slate-800 flex items-center justify-center p-6">
         <div className="text-center max-w-md bg-white border border-amber-200/70 p-8 rounded-3xl shadow-xl animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 text-rose-500 rounded-full mb-6 ring-8 ring-rose-50/50">
               <XCircle className="w-12 h-12 text-rose-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-slate-900">
               Thanh toán thất bại
            </h1>
            <p className="text-slate-600 mb-8 leading-relaxed text-sm">
               Rất tiếc, giao dịch của bạn không thể thực hiện được. Vui lòng
               kiểm tra lại số dư hoặc thử lại với phương thức khác.
            </p>
            <button
               onClick={() => navigate("/")}
               className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
               Quay lại trang chủ
            </button>
         </div>
      </div>
   );
};

