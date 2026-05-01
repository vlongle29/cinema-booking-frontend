import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import {
   ArrowLeft,
   CreditCard,
   Landmark,
   Smartphone,
   QrCode,
   ChevronDown,
   Ticket,
   Gift,
   Wallet,
   ShieldCheck,
} from "lucide-react";
import { cn } from "../lib/utils";
import { bookingService } from "../services/bookingService";
import { paymentService } from "../services/paymentService";
import { seatHoldService } from "../services/seatHoldService";

const MOCK_MOVIE_DETAILS = {
   title: "Phi Vụ Động Trời 2",
   cinema: "CGV Aeon Tân Phú",
   hall: "Cinema 6",
   image: "http://localhost:3845/assets/1b26250be4903592d678845efae190b5f9bb5ea4.png",
};

const paymentMethods = [
   {
      id: "atm",
      name: "ATM card (Thẻ nội địa)",
      icon: ({ className }: { className?: string }) => (
         <img
            src="https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/atm_icon.png"
            alt="NCB Bank"
            className={className}
         />
      ),
      logo: null,
   },
   {
      id: "international",
      name: "Thẻ quốc tế (Visa, Master, Amex, JCB)",
      icon: ({ className }: { className?: string }) => (
         <img
            src="https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/visamaster_logo.png"
            alt="international"
            className={className}
         />
      ),
      logo: null,
   },
   {
      id: "momo",
      name: "MoMo",
      icon: ({ className }: { className?: string }) => (
         <img
            src="https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/momo_icon.png"
            alt="momo"
            className={className}
         />
      ),
      logo: null,
   },
   {
      id: "vnpay",
      name: "VNPAY",
      icon: ({ className }: { className?: string }) => (
         <img
            src="https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/vnpay_newlogo.png"
            alt="vnpay"
            className={className}
         />
      ),
      logo: null,
   },
   {
      id: "NCB",
      name: "NCB Bank",
      icon: ({ className }: { className?: string }) => (
         <img
            src="https://www.ncb-bank.vn/cache-buster-1695119533/website/static/images/logo.png "
            alt="NCB Bank"
            className={className}
         />
      ),
      logo: "https://upload.wikimedia.org/wikipedia/vi/thumb/4/4e/NCB_Bank_logo.png/640px-NCB_Bank_logo.png",
   },
];

const CheckoutPage: React.FC = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const navType = useNavigationType();

   // Lấy dữ liệu từ state của location
   const {
      showtimeId,
      seats,
      timing = "",
      bookingId,
      ticketPrice = 0,
      snackTotal = 0,
      finalTotal = 0,
      totalAmount,
   } = location.state || {};

   // 1. XỬ LÝ KHI ẤN NÚT BACK CỦA TRÌNH DUYỆT
   useEffect(() => {
      const handleBackNavigation = async () => {
         if (navType === "POP" && location.state?.bookingId) {
            try {
               await seatHoldService.releaseSeats(location.state.bookingId);
               navigate(`/seat-select/${location.state.showtimeId}`, {
                  state: {
                     showtimeId: location.state.showtimeId,
                     seats: location.state.seats,
                  },
               });
            } catch (error) {
               console.error("Lỗi khi hủy ghế khi quay lại:", error);
            }
         }
      };

      handleBackNavigation();
   }, [location, navType]);

   // Hàm xử lý quay lại chung: Hủy booking và chuyển hướng
   const handleBackToSeatSelection = useCallback(async () => {
      if (bookingId) {
         try {
            await seatHoldService.releaseSeats(bookingId);
            await bookingService.cancelBooking(
               bookingId,
               "User canceled during payment",
            );
         } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
         }
      }

      navigate(`/seat-select/${showtimeId}`, {
         state: { showtimeId, seats },
         replace: true, // Thay thế entry hiện tại để tránh lặp lịch sử
      });
   }, [bookingId, navigate, showtimeId, seats]);

   // Xử lý khi nhấn nút Back của trình duyệt
   useEffect(() => {
      window.addEventListener("popstate", handleBackToSeatSelection);

      // Cleanup listener khi component unmount
      return () => {
         window.removeEventListener("popstate", handleBackToSeatSelection);
      };
   }, [handleBackToSeatSelection]);

   const [paymentMethod, setPaymentMethod] = useState<string>("");
   const [isProcessing, setIsProcessing] = useState(false);
   const [countdown, setCountdown] = useState(600); // 10 minutes

   useEffect(() => {
      if (countdown <= 0) return;
      const timer = setInterval(() => {
         setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
   }, [countdown]);

   const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
   };

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(amount);
   };

   const handlePayment = async () => {
      if (!bookingId || isProcessing) {
         alert("Phiên đặt vé đã hết hạn hoặc không hợp lệ. Vui lòng thử lại.");
         return;
      }

      setIsProcessing(true);
      try {
         // 1. Ánh xạ ID từ UI sang Enum mà Backend yêu cầu (CASH, CREDIT_CARD, E_WALLET)
         let backendPaymentMethod = "E_WALLET"; // Mặc định cho VNPAY, Momo, ZaloPay, NCB, QR
         if (paymentMethod === "international" || paymentMethod === "atm") {
            backendPaymentMethod = "CREDIT_CARD";
         }

         // 2. Cập nhật phương thức thanh toán chung lên Server (Sử dụng Enum)
         await bookingService.checkoutBooking(bookingId, backendPaymentMethod);

         // 3. Xử lý logic riêng cho từng cổng thanh toán (Sử dụng ID cụ thể của UI)
         if (
            paymentMethod === "vnpay" ||
            paymentMethod === "international" ||
            paymentMethod === "atm"
         ) {
            // Nếu chọn NCB thì gửi bankCode là NCB, ngược lại để trống để VNPAY hiện danh sách ngân hàng
            const bankCode = paymentMethod === "vnpay" ? " " : " ";

            // VNPAY quy định: Số tiền thanh toán = Số tiền thực tế * 100
            // Ưu tiên totalAmount hoặc finalTotal từ state
            const actualAmount = totalAmount || finalTotal || 0;
            if (actualAmount <= 0)
               throw new Error("Số tiền thanh toán không hợp lệ");
            const vnpAmount = (actualAmount * 100).toString();

            const response = await paymentService.createVNPayPayment({
               amount: vnpAmount,
               bankCode,
               bookingId,
            });

            // Axios đã tự động parse JSON.
            // Theo cấu trúc ApiResponse của bạn, URL sẽ nằm trong field 'data'.
            const paymentUrl = response.data.paymentUrl;

            if (
               paymentUrl &&
               typeof paymentUrl === "string" &&
               paymentUrl.startsWith("http")
            ) {
               window.location.href = paymentUrl;
            } else {
               alert("Không nhận được URL thanh toán hợp lệ từ máy chủ.");
            }
         } else {
            // Các phương thức khác chưa tích hợp cổng thanh toán
            alert(
               `Bạn đã chọn ${paymentMethod}. Phương thức này đang được tích hợp, vui lòng chọn VNPAY để test.`,
            );
         }
      } catch (error) {
         console.error("Payment Error:", error);
         alert("Lỗi kết nối đến hệ thống thanh toán. Vui lòng thử lại sau!");
      } finally {
         setIsProcessing(false);
      }
   };

   const displayTotal = totalAmount || finalTotal || 0;

   return (
      <div className="min-h-screen bg-gray-50 text-gray-800 pb-40">
         {/* Header */}
         <header className="bg-[#0B0B0F] text-white py-4 shadow-md">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-center relative">
               <button
                  onClick={() => handleBackToSeatSelection()}
                  className="absolute left-6 p-2 rounded-full hover:bg-white/10 transition-colors"
               >
                  <ArrowLeft size={20} />
               </button>
               <h1 className="text-xl font-bold">Payment</h1>
            </div>
         </header>

         <main className="max-w-7xl mx-auto p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Discounts & Vouchers */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <div className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                           <Ticket className="w-6 h-6 text-rose-500" />
                           <h2 className="text-lg font-semibold">
                              Discounts & Vouchers
                           </h2>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                     </div>
                     <div className="mt-4 flex gap-2">
                        <input
                           type="text"
                           placeholder="Enter voucher code"
                           className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                        />
                        <button className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                           Apply
                        </button>
                     </div>
                  </div>

                  {/* Gift Cards */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <div className="flex items-center gap-3">
                        <Gift className="w-6 h-6 text-rose-500" />
                        <h2 className="text-lg font-semibold">Gift Cards</h2>
                     </div>
                     <p className="text-sm text-gray-500 mt-1">
                        Have a gift card? Apply it here.
                     </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <div className="flex items-center gap-3 mb-4">
                        <Wallet className="w-6 h-6 text-rose-500" />
                        <h2 className="text-lg font-semibold">
                           Payment Methods
                        </h2>
                     </div>
                     <div className="space-y-3">
                        {paymentMethods.map((method) => (
                           <label
                              key={method.id}
                              className={cn(
                                 "flex items-center p-4 border rounded-lg cursor-pointer transition-all",
                                 paymentMethod === method.id
                                    ? "border-rose-500 bg-rose-50 border-2"
                                    : "border-gray-200 hover:border-gray-400",
                              )}
                           >
                              <input
                                 type="radio"
                                 name="paymentMethod"
                                 value={method.id}
                                 checked={paymentMethod === method.id}
                                 onChange={() => setPaymentMethod(method.id)}
                                 className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                              />
                              <div className="ml-4 flex items-center gap-3 flex-grow">
                                 <method.icon
                                    className="w-6 h-6 text-gray-600"
                                    strokeWidth={1.5}
                                 />
                                 <span className="font-medium">
                                    {method.name}
                                 </span>
                              </div>
                              {method.logo && (
                                 <img
                                    src={method.logo}
                                    alt={`${method.name} logo`}
                                    className="h-6 object-contain"
                                 />
                              )}
                           </label>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right Column (Sticky) */}
               <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                     {/* Countdown Timer */}
                     <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider">
                           Time Remaining
                        </p>
                        <p className="text-4xl font-mono font-bold tracking-wider">
                           {formatTime(countdown)}
                        </p>
                     </div>

                     {/* Booking Summary */}
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold border-b pb-3 mb-4">
                           Booking Summary
                        </h2>
                        <div className="space-y-3 text-sm">
                           <div className="flex justify-between">
                              <span className="text-gray-600">
                                 Tickets ({seats.length} seats)
                              </span>
                              <span className="font-medium">
                                 {formatCurrency(ticketPrice)}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-gray-600">
                                 Snacks & Drinks
                              </span>
                              <span className="font-medium">
                                 {formatCurrency(snackTotal)}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-gray-600">Discounts</span>
                              <span className="font-medium text-green-600">
                                 - {formatCurrency(0)}
                              </span>
                           </div>
                           <div className="border-t my-3" />
                           <div className="flex justify-between text-base font-bold">
                              <span>Total Amount</span>
                              <span className="text-rose-600">
                                 {formatCurrency(displayTotal)}
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} />
                        <span>Secure and encrypted payment</span>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         {/* Sticky Footer */}
         <div className="fixed bottom-0 left-0 w-full bg-[#0B0B0F]/95 backdrop-blur-sm border-t border-gray-800 p-4 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
               {/* Previous Button */}
               <button
                  onClick={handleBackToSeatSelection}
                  className="px-6 py-3 rounded-lg font-semibold text-white hover:bg-white/10 transition-colors hidden md:block"
               >
                  Previous
               </button>

               {/* Movie Details */}
               <div className="flex items-center gap-4 flex-grow">
                  <img
                     src={MOCK_MOVIE_DETAILS.image}
                     alt={MOCK_MOVIE_DETAILS.title}
                     className="w-12 h-16 object-cover rounded-md hidden sm:block"
                  />
                  <div className="text-white">
                     <h3 className="font-bold text-sm md:text-base">
                        {MOCK_MOVIE_DETAILS.title}
                     </h3>
                     <p className="text-xs text-gray-400">
                        {MOCK_MOVIE_DETAILS.cinema} • {MOCK_MOVIE_DETAILS.hall}{" "}
                        • Seats: {seats.join(", ")}
                     </p>
                  </div>
               </div>

               {/* Payment Action */}
               <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                     <span className="text-gray-400 text-xs uppercase">
                        Total
                     </span>
                     <p className="text-white font-bold text-xl">
                        {formatCurrency(displayTotal)}
                     </p>
                  </div>
                  <button
                     onClick={handlePayment}
                     disabled={isProcessing}
                     className={cn(
                        "flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all duration-300",
                        isProcessing && "opacity-70 cursor-not-allowed",
                     )}
                  >
                     {isProcessing ? (
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           PROCESSING...
                        </div>
                     ) : (
                        "PAYMENT"
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckoutPage;
