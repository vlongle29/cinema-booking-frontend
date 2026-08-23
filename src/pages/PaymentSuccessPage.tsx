import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Home, Download } from "lucide-react";
import { usePaymentResult } from "@/features/checkout/hooks/usePaymentResult";
import {
   PaymentFailure,
   PaymentLoading,
   TicketCard,
} from "@/features/checkout";

export const PaymentSuccess: React.FC = () => {
   const navigate = useNavigate();
   const {
      isSuccess,
      loading,
      bookingData,
      transactionNo,
      bookingId,
      amount,
   } = usePaymentResult();

   if (loading) {
      return <PaymentLoading />;
   }

   if (!isSuccess) {
      return <PaymentFailure />;
   }

   return (
      <div className="min-h-screen bg-[#fefce8] text-slate-800 py-12 sm:py-16 px-4 relative overflow-hidden">
         {/* Hiệu ứng nền nhẹ nhàng đồng bộ với website */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-300/20 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-[100px] pointer-events-none" />

         <div className="max-w-2xl mx-auto relative z-10">
            {/* Success Header */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 ring-8 ring-emerald-50 shadow-sm">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
               </div>
               <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight text-slate-900">
                  Đặt vé thành công!
               </h1>
               <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Chúc mừng! Đơn hàng của bạn đã được thanh toán thành công. Dưới đây là vé điện tử của bạn.
               </p>
            </div>

            {/* Ticket Card */}
            <TicketCard
               bookingData={bookingData}
               transactionNo={transactionNo}
               bookingId={bookingId}
               amount={amount}
            />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
               <button
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-amber-50/60 rounded-2xl font-bold transition-all border border-amber-200/80 text-slate-700 shadow-sm cursor-pointer"
               >
                  <Home size={18} className="text-amber-600" />
                  Quay về trang chủ
               </button>
               <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] rounded-2xl font-bold transition-all shadow-lg shadow-amber-500/25 text-white cursor-pointer"
               >
                  <Download size={18} />
                  Tải xuống vé (PDF)
               </button>
            </div>
         </div>
      </div>
   );
};
