import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PaymentFailure: React.FC = () => {
   const navigate = useNavigate();
   return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-6">
         <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500/20 rounded-full mb-6">
               <XCircle className="w-12 h-12 text-rose-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thanh toán thất bại</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
               Rất tiếc, giao dịch của bạn không thể thực hiện được. Vui lòng
               kiểm tra lại số dư hoặc thử phương thức khác.
            </p>
            <button
               onClick={() => navigate("/")}
               className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10"
            >
               Quay lại trang chủ
            </button>
         </div>
      </div>
   );
};

