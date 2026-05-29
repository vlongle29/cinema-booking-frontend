import React, { useState } from "react";
import {
   useCheckoutTimer,
   useCheckoutNavigation,
   usePayment,
   CheckoutFooter,
   CheckoutSummary,
   DiscountSection,
   PaymentMethods,
} from "@/features/checkout";

const CheckoutPage: React.FC = () => {
   // 1. Quản lý điều hướng & State lấy từ Route
   const { handleBackToSeatSelection, state } = useCheckoutNavigation();
   const {
      seats = [],
      ticketPrice = 0,
      snackTotal = 0,
      totalAmount,
      finalTotal,
      bookingId,
   } = state;
   const displayTotal = totalAmount || finalTotal || 0;

   // 2. Quản lý Timer
   const { formattedTime } = useCheckoutTimer(600);

   // 3. Quản lý Thanh toán
   const [selectedPaymentMethod, setSelectedPaymentMethod] =
      useState<string>("vnpay");
   const { isProcessing, handlePayment } = usePayment(bookingId, displayTotal);

   return (
      <div className="min-h-screen text-white pb-40 pt-20 bg-[#0B0B0F] relative overflow-hidden">
         {/* Background Ambience - Đồng bộ với SeatSelectPage */}
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

         {/* ... (Header giữ nguyên) ... */}

         <main className="max-w-7xl mx-auto p-6 lg:p-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column */}
               <div className="lg:col-span-2 space-y-6">
                  <DiscountSection />

                  <PaymentMethods
                     selectedMethod={selectedPaymentMethod}
                     onSelect={setSelectedPaymentMethod}
                  />
               </div>

               {/* Right Column (Sticky) */}
               <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                     <CheckoutSummary
                        timer={formattedTime}
                        seatCount={seats.length}
                        ticketPrice={ticketPrice}
                        snackTotal={snackTotal}
                        totalAmount={displayTotal}
                     />
                  </div>
               </div>
            </div>
         </main>

         <CheckoutFooter
            seats={seats}
            totalAmount={displayTotal}
            isProcessing={isProcessing}
            onBack={handleBackToSeatSelection}
            onPayment={() => handlePayment(selectedPaymentMethod)}
         />
      </div>
   );
};

export default CheckoutPage;
