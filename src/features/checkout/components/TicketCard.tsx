import React, { useState } from "react";
import {
   Calendar,
   Ticket,
   MapPin,
   User,
   CreditCard,
   Clock,
   ShoppingBag,
   CheckCircle2,
   Film,
   DoorOpen,
   ImageOff,
} from "lucide-react";
import { API_BASE_URL } from "@/constants/api";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import type { BookingPaymentDetail } from "@/services/paymentService";

interface TicketCardProps {
   bookingData?: BookingPaymentDetail | null;
   showtimeData?: any;
   transactionNo?: string | null;
   bookingId?: string | null;
   amount?: string | null;
}

const PAYMENT_METHOD_NAMES: Record<string, string> = {
   E_WALLET: "Ví điện tử (VNPAY / QR)",
   VNPAY: "VNPAY",
   CREDIT_CARD: "Thẻ quốc tế / ATM",
   CASH: "Tiền mặt",
   MOMO: "MoMo",
   ZALOPAY: "ZaloPay",
};

export const TicketCard: React.FC<TicketCardProps> = ({
   bookingData,
   showtimeData,
   transactionNo,
   bookingId,
   amount,
}) => {
   const [imgError, setImgError] = useState(false);

   // Lấy dữ liệu tổng hợp từ bookingData hoặc fallback
   const movieTitle =
      bookingData?.showtime?.movieTitle ||
      showtimeData?.movie?.title ||
      "Vé xem phim";

   const rawPosterUrl =
      bookingData?.showtime?.posterUrl || showtimeData?.movie?.posterUrl;

   const posterUrl = rawPosterUrl
      ? rawPosterUrl.startsWith("http")
         ? rawPosterUrl
         : `${API_BASE_URL}${rawPosterUrl.startsWith("/") ? "" : "/"}${rawPosterUrl}`
      : null;

   const branchName =
      bookingData?.showtime?.branchName ||
      showtimeData?.branchName ||
      "CineBook Cinema";

   const roomName =
      bookingData?.showtime?.roomName || showtimeData?.roomName || "Rạp";

   const cityName = bookingData?.showtime?.cityName || "";

   const startTime =
      bookingData?.showtime?.startTime || showtimeData?.startTime;

   const bookingCode =
      bookingData?.bookingCode ||
      (bookingId ? `#${bookingId.slice(0, 8).toUpperCase()}` : "---");

   const finalTransactionCode =
      bookingData?.payment?.transactionCode || transactionNo || "---";

   const paymentMethodRaw = bookingData?.payment?.paymentMethod || "E_WALLET";
   const paymentMethodDisplay =
      PAYMENT_METHOD_NAMES[paymentMethodRaw.toUpperCase()] || paymentMethodRaw;

   const finalAmount =
      bookingData?.payment?.finalAmount !== undefined
         ? bookingData.payment.finalAmount
         : amount
           ? Number(amount) > 1000000 && Number(amount) % 100 === 0
              ? Number(amount) / 100
              : Number(amount)
           : 0;

   const seatsList = bookingData?.seats || [];
   const seatsDisplay =
      seatsList.length > 0
         ? seatsList.map((s) => s.seatNumber).join(", ")
         : "---";

   const productsList = bookingData?.products || [];

   return (
      <div className="bg-white rounded-3xl overflow-hidden border border-amber-200/70 shadow-xl mb-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
         {/* ── Phần đầu vé: Thông tin phim & rạp chiếu ── */}
         <div className="p-6 sm:p-8 border-b border-dashed border-amber-300/80 relative bg-gradient-to-b from-amber-50/50 to-white">
            {/* Vết cắt tròn 2 bên cạnh vé - trùng màu nền trang web #fefce8 */}
            <div className="absolute -bottom-3.5 -left-3.5 w-7 h-7 bg-[#fefce8] rounded-full border border-amber-200/80 shadow-inner z-10" />
            <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 bg-[#fefce8] rounded-full border border-amber-200/80 shadow-inner z-10" />

            <div className="flex flex-col gap-5">
               {/* Badge mã vé & trạng thái */}
               <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                     <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300/60 shadow-sm">
                        {bookingCode}
                     </span>
                     {bookingData?.bookingDate && (
                        <span className="text-xs text-slate-500">
                           Đặt lúc: {formatDateTime(bookingData.bookingDate)}
                        </span>
                     )}
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                     <CheckCircle2 size={14} className="text-emerald-600" />
                     {bookingData?.status === "PAID"
                        ? "ĐÃ THANH TOÁN"
                        : bookingData?.status || "THÀNH CÔNG"}
                  </span>
               </div>

               {/* Thông tin phim kèm Poster */}
               <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Poster Thumbnail */}
                  <div className="w-24 sm:w-28 h-36 sm:h-40 rounded-xl overflow-hidden shadow-md border border-amber-200/70 bg-amber-50 shrink-0 flex items-center justify-center">
                     {posterUrl && !imgError ? (
                        <img
                           src={posterUrl}
                           alt={movieTitle}
                           className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                           onError={() => setImgError(true)}
                        />
                     ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                           <ImageOff className="w-8 h-8 mb-1 opacity-50 text-amber-500" />
                           <span className="text-[9px] uppercase font-semibold">No Poster</span>
                        </div>
                     )}
                  </div>

                  {/* Chi tiết bên cạnh poster */}
                  <div className="flex-1 w-full space-y-3">
                     <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-900">
                        {movieTitle}
                     </h2>

                     {/* Lưới thông tin suất chiếu & rạp */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/50">
                        <div className="space-y-1">
                           <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                              Thời gian chiếu
                           </span>
                           <div className="flex items-center gap-2 text-slate-900 font-semibold">
                              <Calendar size={15} className="text-amber-600 shrink-0" />
                              <span>
                                 {startTime ? formatDateTime(startTime) : "Không xác định"}
                              </span>
                           </div>
                        </div>

                        <div className="space-y-1">
                           <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                              Rạp & Phòng chiếu
                           </span>
                           <div className="flex items-center gap-2 text-slate-900 font-semibold">
                              <MapPin size={15} className="text-amber-600 shrink-0" />
                              <span className="truncate">
                                 {branchName}
                                 {cityName ? ` (${cityName})` : ""}
                              </span>
                           </div>
                           <div className="flex items-center gap-1 text-xs text-slate-600 pl-5">
                              <DoorOpen size={13} />
                              <span>Phòng: {roomName}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Ghế ngồi */}
               <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/50 space-y-1.5 text-sm">
                  <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider block">
                     Ghế ngồi ({seatsList.length} vé)
                  </span>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                     <Ticket size={16} className="text-amber-600 shrink-0" />
                     <span className="text-base text-amber-700 font-mono tracking-wide">
                        {seatsDisplay}
                     </span>
                  </div>
                  {seatsList.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-1 pl-6">
                        {seatsList.map((s, idx) => (
                           <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-md bg-white border border-amber-200 text-xs text-slate-700 font-medium shadow-xs"
                           >
                              {s.seatNumber} • {s.seatType} ({formatCurrency(s.price)})
                           </span>
                        ))}
                     </div>
                  )}
               </div>

               {/* Bắp nước / Combo nếu có */}
               {productsList.length > 0 && (
                  <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/50 text-sm space-y-2">
                     <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
                        <ShoppingBag size={14} className="text-amber-600" />
                        <span>Bắp nước / Combo đi kèm</span>
                     </div>
                     <div className="space-y-1 pl-5">
                        {productsList.map((item, idx) => (
                           <div
                              key={idx}
                              className="flex justify-between items-center text-xs text-slate-700"
                           >
                              <span>
                                 {item.name}{" "}
                                 <span className="text-slate-400">x{item.quantity}</span>
                              </span>
                              <span className="font-semibold text-slate-900">
                                 {formatCurrency(item.price * item.quantity)}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Thông tin khách hàng */}
               {bookingData?.customer && (
                  <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-1 border-t border-slate-100">
                     <div className="flex items-center gap-1.5">
                        <User size={14} className="text-amber-600" />
                        <span className="text-slate-800 font-semibold">
                           {bookingData.customer.name}
                        </span>
                        {bookingData.customer.phone && (
                           <span>• {bookingData.customer.phone}</span>
                        )}
                     </div>
                     {bookingData.customer.email && (
                        <span className="text-slate-500 truncate max-w-[200px]">
                           {bookingData.customer.email}
                        </span>
                     )}
                  </div>
               )}
            </div>
         </div>

         {/* ── Phần thân vé: Chi tiết thanh toán ── */}
         <div className="p-6 sm:p-8 bg-amber-50/30">
            <div className="flex flex-col gap-3.5">
               {/* Mã giao dịch & phương thức */}
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Mã giao dịch</span>
                  <span className="font-mono text-slate-800 font-bold">
                     {finalTransactionCode}
                  </span>
               </div>

               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Phương thức thanh toán</span>
                  <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                     <CreditCard size={15} className="text-amber-600" />
                     {paymentMethodDisplay}
                  </span>
               </div>

               {bookingData?.payment?.paymentTime && (
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">Thời gian thanh toán</span>
                     <span className="flex items-center gap-1.5 text-slate-700 text-xs font-medium">
                        <Clock size={13} className="text-slate-400" />
                        {formatDateTime(bookingData.payment.paymentTime)}
                     </span>
                  </div>
               )}

               {/* Chi tiết tiền vé / food / discount nếu có */}
               {bookingData?.payment && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/70 text-xs text-slate-600">
                     <div className="flex justify-between">
                        <span>Tổng tiền vé:</span>
                        <span className="text-slate-800 font-semibold">
                           {formatCurrency(bookingData.payment.totalTicketPrice)}
                        </span>
                     </div>
                     {bookingData.payment.totalFoodPrice > 0 && (
                        <div className="flex justify-between">
                           <span>Tổng bắp nước:</span>
                           <span className="text-slate-800 font-semibold">
                              {formatCurrency(bookingData.payment.totalFoodPrice)}
                           </span>
                        </div>
                     )}
                     {bookingData.payment.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-medium">
                           <span>Giảm giá khuyến mãi:</span>
                           <span>
                              -{formatCurrency(bookingData.payment.discountAmount)}
                           </span>
                        </div>
                     )}
                  </div>
               )}

               <div className="border-t border-slate-200 my-1" />

               {/* Tổng thanh toán */}
               <div className="flex justify-between items-center pt-1">
                  <div>
                     <span className="text-base sm:text-lg font-bold text-slate-900 block">
                        Tổng thanh toán
                     </span>
                     <span className="text-[11px] text-slate-500 block">
                        Đã bao gồm VAT & các loại phí
                     </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
                     {formatCurrency(finalAmount)}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
};

