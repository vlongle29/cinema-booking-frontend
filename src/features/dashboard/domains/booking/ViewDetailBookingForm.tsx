import React from "react";
import {
   Dialog,
   DialogContent,
} from "@/components/ui/dialog";
import { formatDate, formatCurrency } from "../../../../utils/formatters";
import {
   User,
   Film,
   MapPin,
   Clock,
   Ticket,
   ShoppingBag,
   CreditCard,
   CalendarDays,
   Hash,
   Building2,
   DoorOpen,
   Phone,
   Mail,
   BadgeCheck,
   Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Seat {
   seatNumber: string;
   seatType: string;
   price: number;
}

interface Product {
   name: string;
   quantity: number;
   price: number;
}

interface BookingDetail {
   bookingId: string;
   bookingCode: string;
   status: string;
   bookingDate: string;
   showtime: {
      movieTitle: string;
      branchName: string;
      roomName: string;
      startTime: string;
      cityName: string;
   };
   seats: Seat[];
   products: Product[];
   payment: {
      totalTicketPrice: number;
      totalFoodPrice: number;
      discountAmount: number;
      finalAmount: number;
      paymentMethod: string;
      transactionCode: string;
      paymentTime: string;
   };
   customer: {
      name: string;
      email: string;
      phone: string;
   };
}

interface BookingDetailModalProps {
   isOpen: boolean;
   onClose: () => void;
   data?: BookingDetail | null;
   isLoading?: boolean;
}

// ── Status Badge ───────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
   PAID: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
   CANCELLED: "bg-red-500/20 text-red-400 border-red-500/40",
   EXPIRED: "bg-gray-500/20 text-gray-400 border-gray-500/40",
   PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/40",
};

const StatusBadge = ({ status }: { status: string }) => (
   <span
      className={`px-3 py-1 rounded-md text-xs font-bold border uppercase tracking-wider ${STATUS_STYLES[status] ?? STATUS_STYLES.PENDING}`}
   >
      {status}
   </span>
);

// ── Section Heading ────────────────────────────────────────────────────────────
const SectionHeading = ({
   icon: Icon,
   children,
}: {
   icon: React.ElementType;
   children: React.ReactNode;
}) => (
   <h3 className="flex items-center gap-2 text-white font-semibold text-sm border-b border-gray-800 pb-2 mb-3">
      <Icon size={14} className="text-[#f84565]" />
      {children}
   </h3>
);

// ── Info Row ───────────────────────────────────────────────────────────────────
const InfoRow = ({
   label,
   value,
   valueClass = "text-gray-200",
}: {
   label: string;
   value: React.ReactNode;
   valueClass?: string;
}) => (
   <div className="flex justify-between items-center gap-4">
      <span className="text-gray-500 text-xs shrink-0">{label}</span>
      <span className={`font-medium text-xs text-right ${valueClass}`}>{value}</span>
   </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
   isOpen,
   onClose,
   data,
   isLoading = false,
}) => {
   return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
         <DialogContent
            showCloseButton={false}
            className="max-w-2xl w-[95vw] bg-[#131316] border border-[#2a2a2e] text-white p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)] gap-0"
         >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2e] bg-gradient-to-r from-[#1a1a1e] to-[#131316]">
               <div>
                  <h2 className="text-white font-semibold text-base leading-none">
                     Chi tiết đơn hàng
                  </h2>
                  {data && (
                     <p className="text-[#f84565] text-xs font-mono mt-1">
                        #{data.bookingCode}
                     </p>
                  )}
               </div>
               <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
                  title="Đóng"
               >
                  ×
               </button>
            </div>

            {/* ── Body ── */}
            <div className="px-6 py-5 max-h-[75vh] overflow-y-auto space-y-5">

               {/* Loading state */}
               {isLoading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                     <Loader2 size={32} className="animate-spin text-[#f84565]" />
                     <p className="text-gray-500 text-sm">Đang tải chi tiết đơn hàng...</p>
                  </div>
               )}

               {/* Error / empty state */}
               {!isLoading && !data && (
                  <div className="flex flex-col items-center justify-center py-16 gap-2">
                     <p className="text-gray-500 text-sm">Không tìm thấy thông tin đơn hàng.</p>
                  </div>
               )}

               {/* Content */}
               {!isLoading && data && (
                  <>
                     {/* Status bar */}
                     <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e1e22] border border-[#2a2a2e] rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3">
                           <span className="text-gray-500 text-xs">Trạng thái:</span>
                           <StatusBadge status={data.status} />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                           <CalendarDays size={12} />
                           <span>Ngày đặt:</span>
                           <span className="text-gray-300 font-medium">{formatDate(data.bookingDate)}</span>
                        </div>
                     </div>

                     {/* 2-col grid: Customer + Showtime */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer */}
                        <div className="bg-[#1e1e22] border border-[#2a2a2e] rounded-lg p-4 space-y-3">
                           <SectionHeading icon={User}>Khách hàng</SectionHeading>
                           <InfoRow label="Họ tên:" value={data.customer.name || "Khách vãng lai"} />
                           <InfoRow
                              label="SĐT:"
                              value={
                                 <span className="flex items-center gap-1">
                                    <Phone size={10} />
                                    {data.customer.phone || "---"}
                                 </span>
                              }
                           />
                           <InfoRow
                              label="Email:"
                              value={
                                 <span className="flex items-center gap-1">
                                    <Mail size={10} />
                                    {data.customer.email || "---"}
                                 </span>
                              }
                           />
                        </div>

                        {/* Showtime */}
                        <div className="bg-[#1e1e22] border border-[#2a2a2e] rounded-lg p-4 space-y-3">
                           <SectionHeading icon={Film}>Suất chiếu</SectionHeading>
                           <InfoRow
                              label="Phim:"
                              value={data.showtime.movieTitle}
                              valueClass="text-[#f84565] font-semibold"
                           />
                           <InfoRow
                              label="Rạp:"
                              value={
                                 <span className="flex items-center gap-1">
                                    <Building2 size={10} />
                                    {data.showtime.branchName}
                                 </span>
                              }
                           />
                           <InfoRow
                              label="Thành phố:"
                              value={
                                 <span className="flex items-center gap-1">
                                    <MapPin size={10} />
                                    {data.showtime.cityName}
                                 </span>
                              }
                           />
                           <InfoRow
                              label="Phòng:"
                              value={
                                 <span className="flex items-center gap-1">
                                    <DoorOpen size={10} />
                                    {data.showtime.roomName}
                                 </span>
                              }
                           />
                           <InfoRow
                              label="Giờ chiếu:"
                              value={
                                 <span className="flex items-center gap-1 text-emerald-400">
                                    <Clock size={10} />
                                    {formatDate(data.showtime.startTime)}
                                 </span>
                              }
                              valueClass="text-emerald-400"
                           />
                        </div>
                     </div>

                     {/* Seats & Products Table */}
                     <div className="bg-[#1e1e22] border border-[#2a2a2e] rounded-lg overflow-hidden">
                        <div className="px-4 pt-4 pb-2">
                           <SectionHeading icon={ShoppingBag}>Dịch vụ đã chọn</SectionHeading>
                        </div>
                        <table className="w-full text-xs text-left">
                           <thead className="bg-[#252529] text-gray-500 uppercase tracking-wider">
                              <tr>
                                 <th className="px-4 py-2.5 font-semibold">Hạng mục</th>
                                 <th className="px-4 py-2.5 font-semibold">Chi tiết</th>
                                 <th className="px-4 py-2.5 font-semibold text-right">Đơn giá</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-[#2a2a2e]">
                              {data.seats.map((seat, i) => (
                                 <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-gray-300 flex items-center gap-1.5">
                                       <Ticket size={12} className="text-[#f84565]" />
                                       Vé xem phim
                                    </td>
                                    <td className="px-4 py-3">
                                       <span className="font-semibold text-white">{seat.seatNumber}</span>
                                       <span className="text-gray-500 ml-1.5">({seat.seatType})</span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-200">
                                       {formatCurrency(seat.price)}
                                    </td>
                                 </tr>
                              ))}

                              {data.products && data.products.length > 0 ? (
                                 data.products.map((product, i) => (
                                    <tr key={`prod-${i}`} className="hover:bg-white/[0.02] transition-colors">
                                       <td className="px-4 py-3 text-gray-300">🍿 Đồ ăn / Nước</td>
                                       <td className="px-4 py-3 font-medium text-white">
                                          {product.name} × {product.quantity}
                                       </td>
                                       <td className="px-4 py-3 text-right text-gray-200">
                                          {formatCurrency(product.price)}
                                       </td>
                                    </tr>
                                 ))
                              ) : (
                                 <tr>
                                    <td colSpan={3} className="px-4 py-3 text-center text-gray-600 italic">
                                       Không có đồ ăn / thức uống
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>

                     {/* Payment */}
                     <div className="bg-[#1e1e22] border border-[#2a2a2e] rounded-lg p-4">
                        <SectionHeading icon={CreditCard}>Thanh toán</SectionHeading>
                        <div className="flex flex-col md:flex-row gap-5">
                           {/* Method */}
                           <div className="flex-1 space-y-2.5">
                              <InfoRow label="Phương thức:" value={data.payment.paymentMethod} />
                              <InfoRow
                                 label="Mã giao dịch:"
                                 value={
                                    <span className="font-mono flex items-center gap-1">
                                       <Hash size={10} />
                                       {data.payment.transactionCode || "---"}
                                    </span>
                                 }
                              />
                              <InfoRow
                                 label="Thời gian T.T:"
                                 value={formatDate(data.payment.paymentTime)}
                              />
                           </div>

                           {/* Summary */}
                           <div className="flex-1 space-y-2.5 border-t md:border-t-0 md:border-l border-[#2a2a2e] pt-4 md:pt-0 md:pl-5">
                              <InfoRow
                                 label="Tiền vé:"
                                 value={formatCurrency(data.payment.totalTicketPrice)}
                              />
                              <InfoRow
                                 label="Đồ ăn/Nước:"
                                 value={formatCurrency(data.payment.totalFoodPrice)}
                              />
                              <InfoRow
                                 label="Giảm giá:"
                                 value={`-${formatCurrency(data.payment.discountAmount)}`}
                                 valueClass="text-emerald-400"
                              />
                              <div className="flex justify-between items-center pt-3 mt-2 border-t border-[#2a2a2e]">
                                 <span className="text-gray-300 text-sm font-medium">Tổng tiền:</span>
                                 <span className="text-xl font-bold text-[#f84565]">
                                    {formatCurrency(data.payment.finalAmount)}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </>
               )}
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-[#2a2a2e] bg-[#1a1a1e] flex justify-end gap-3">
               <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-md bg-[#2a2a2e] text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
               >
                  Đóng
               </button>
               {data?.status === "PAID" && (
                  <button className="px-5 py-2 rounded-md bg-[#f84565]/90 text-white hover:bg-[#f84565] transition-colors text-sm font-medium flex items-center gap-1.5 shadow-lg shadow-[#f84565]/20">
                     <BadgeCheck size={14} />
                     In vé
                  </button>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default BookingDetailModal;