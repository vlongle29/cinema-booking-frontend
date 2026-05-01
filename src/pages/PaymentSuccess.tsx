import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
   CheckCircle2,
   Home,
   Ticket,
   Download,
   Calendar,
   MapPin,
   XCircle,
} from "lucide-react";

export const PaymentSuccess: React.FC = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();

   // Lấy các thông số từ VNPAY callback qua URL query parameters
   const responseCode = searchParams.get("vnp_ResponseCode");
   const amount = searchParams.get("vnp_Amount");
   const transactionNo = searchParams.get("vnp_TransactionNo");
   const bookingId = searchParams.get("vnp_OrderInfo");

   // VNPAY trả về responseCode '00' nếu giao dịch thành công
   const isSuccess = responseCode === "00";

   const formatCurrency = (value: string | null) => {
      if (!value) return "0 VND";
      // VNPAY amount được nhân 100 so với giá trị thực tế
      const amountNum = Number(value) / 100;
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(amountNum);
   };

   if (!isSuccess) {
      return (
         <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-6">
            <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
               <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500/20 rounded-full mb-6">
                  <XCircle className="w-12 h-12 text-rose-500" />
               </div>
               <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
               <p className="text-gray-400 mb-8 leading-relaxed">
                  Rất tiếc, giao dịch của bạn không thể thực hiện được. Vui lòng
                  kiểm tra lại số dư tài khoản hoặc thử lại với phương thức
                  khác.
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
   }

   return (
      <div className="min-h-screen bg-[#0B0B0F] text-white py-20 px-4">
         <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
               <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
               </div>
               <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
               <p className="text-gray-400">
                  Chúc mừng! Bạn đã đặt vé thành công. Dưới đây là thông tin vé
                  điện tử của bạn.
               </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#1a1a1d] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
               <div className="p-8 border-b border-dashed border-white/20 relative">
                  {/* Các vòng tròn trang trí tạo kiểu vé xem phim */}
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#0B0B0F] rounded-full border border-white/10"></div>
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#0B0B0F] rounded-full border border-white/10"></div>

                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="w-full md:w-32 h-44 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                        <img
                           src="http://localhost:3845/assets/1b26250be4903592d678845efae190b5f9bb5ea4.png"
                           alt="Movie Poster"
                           className="w-full h-full object-cover"
                        />
                     </div>
                     <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-white">
                           Phi Vụ Động Trời 2
                        </h2>
                        <div className="grid grid-cols-2 gap-y-5 text-sm">
                           <div className="space-y-1">
                              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                                 Ngày & Giờ
                              </span>
                              <div className="flex items-center gap-2 text-gray-200 font-medium">
                                 <Calendar
                                    size={14}
                                    className="text-rose-500"
                                 />
                                 <span>2026-02-18 • 11:00 AM</span>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                                 Ghế
                              </span>
                              <div className="flex items-center gap-2 text-gray-200 font-medium">
                                 <Ticket size={14} className="text-rose-500" />
                                 <span className="font-bold">C5, C6</span>
                              </div>
                           </div>
                           <div className="col-span-2 space-y-1">
                              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                                 Rạp chiếu
                              </span>
                              <div className="flex items-center gap-2 text-gray-200 font-medium">
                                 <MapPin size={14} className="text-rose-500" />
                                 <span>CGV Aeon Tân Phú • Cinema 6</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-white/[0.02]">
                  <div className="flex flex-col gap-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Mã giao dịch</span>
                        <span className="font-mono text-gray-300">
                           {transactionNo || "N/A"}
                        </span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Mã đặt vé</span>
                        <span className="text-gray-300 font-semibold">
                           #{bookingId || "N/A"}
                        </span>
                     </div>
                     <div className="border-t border-white/5 my-2"></div>
                     <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-200">
                           Tổng thanh toán
                        </span>
                        <span className="text-3xl font-bold text-rose-500">
                           {formatCurrency(amount)}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

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
