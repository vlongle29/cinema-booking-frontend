import React from "react";
import { Eye, XCircle, RotateCcw } from "lucide-react";
import { BookingListItem } from "../../../services/bookingService";
import { Column, FilterField } from "../DashboardEntityList";

export const getBookingColumns = (
   onAction: (id: string, type: string) => void,
): Column<BookingListItem>[] => [
   {
      id: "id",
      label: "Booking Code",
      render: (booking) => (
         <div>
            <span className="text-[#f84565] font-medium uppercase">
               {booking.id.substring(0, 8)}
            </span>
            <div className="text-[10px] text-[#797b7d] mt-1">
               {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
            </div>
         </div>
      ),
   },
   {
      id: "customer",
      label: "Customer",
      render: (booking) => (
         <div>
            <div className="font-medium text-sm text-white">
               {booking.customerId
                  ? `ID: ${booking.customerId.substring(0, 8)}`
                  : "Guest"}
            </div>
            <div className="text-xs text-[#797b7d]">
               {booking.paymentMethod || "N/A"}
            </div>
         </div>
      ),
   },
   {
      id: "movie",
      label: "Showtime ID",
      render: (booking) => (
         <div className="text-sm text-white font-medium uppercase">
            {booking.showtimeId.substring(0, 8)}
         </div>
      ),
   },
   {
      id: "seats",
      label: "Seats",
      render: (booking) => (
         <div className="flex gap-1 flex-wrap max-w-[120px]">
            {booking.tickets?.map((t: any) => (
               <span
                  key={t.id}
                  className="bg-[#393939] text-white text-[10px] px-1.5 py-0.5 rounded border border-[#4a4a4a]"
               >
                  {t.seatNumber}
               </span>
            )) || <span className="text-[#797b7d] text-xs">No tickets</span>}
         </div>
      ),
   },
   {
      id: "total",
      label: "Total",
      render: (booking) => (
         <div className="text-white font-bold text-sm">
            {new Intl.NumberFormat("vi-VN", {
               style: "currency",
               currency: "VND",
            }).format(booking.finalAmount)}
         </div>
      ),
   },
   {
      id: "status",
      label: "Status",
      render: (booking) => {
         const styles: Record<string, string> = {
            PAID: "bg-green-500/10 text-green-500 border-green-500/20",
            PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
            EXPIRED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
         };
         return (
            <span
               className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[booking.status] || styles.PENDING}`}
            >
               {booking.status}
            </span>
         );
      },
   },
   {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (booking) => (
         <div className="flex justify-end gap-2">
            <button
               onClick={() => onAction(booking.id, "view")}
               className="p-1.5 text-[#797b7d] hover:text-white hover:bg-white/5 rounded transition-all"
            >
               <Eye size={16} />
            </button>
            <button
               onClick={() => onAction(booking.id, "cancel")}
               className="p-1.5 text-[#797b7d] hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
            >
               <XCircle size={16} />
            </button>
         </div>
      ),
   },
];

export const getBookingFilters = (): FilterField[] => [
   {
      name: "search",
      label: "Search",
      type: "text",
      placeholder: "Code or phone...",
   },
   {
      name: "status",
      label: "Status",
      type: "select",
      options: [
         { value: "PAID", label: "Paid" },
         { value: "PENDING", label: "Pending" },
         { value: "CANCELLED", label: "Cancelled" },
         { value: "EXPIRED", label: "Expired" },
      ],
   },
];
