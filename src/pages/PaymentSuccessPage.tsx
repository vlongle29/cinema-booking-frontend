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
      showtimeData,
      transactionNo,
      bookingId,
      amount,
   } = usePaymentResult();

   if (!isSuccess) {
      <PaymentFailure />;
   }

   if (loading) {
      <PaymentLoading />;
   }

   return (
      <div className="min-h-screen bg-[#0B0B0F] text-white py-20 px-4">
         <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
               <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
               </div>
               <h1 className="text-4xl font-bold mb-2">Đặt vé thành công!</h1>
               <p className="text-gray-400">
                  Chúc mừng! Bạn đã đặt vé thành công. Dưới đây là thông tin vé
                  điện tử của bạn.
               </p>
            </div>

            {/* Ticket Card */}
            <TicketCard
               showtimeData={showtimeData}
               bookingData={bookingData}
               transactionNo={transactionNo}
               bookingId={bookingId}
               amount={amount}
            />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
               <button
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10 text-white"
               >
                  <Home size={20} />
                  Quay về trang chủ
               </button>
               <button className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:brightness-110 active:scale-[0.98] rounded-2xl font-bold transition-all shadow-lg shadow-rose-500/20 text-white">
                  <Download size={20} />
                  Tải xuống vé (PDF)
               </button>
            </div>
         </div>
      </div>
   );
};
