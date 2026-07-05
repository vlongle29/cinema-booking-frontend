import React from "react";
import {
   Eye,
   Trash2,
   EllipsisVertical,
   Calendar,
   User,
   Ticket,
   CreditCard,
} from "lucide-react";
import type {
   Column,
   FilterField,
} from "@/features/dashboard/shared/DashboardEntityList";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getBookingColumns = (handlers: {
   onView: (booking: any) => void;
   onDelete: (id: string) => void;
}): Column<any>[] => [
   {
      id: "bookingCode",
      label: "Mã đặt vé",
      render: (booking) => (
         <div className="flex items-center gap-2">
            <Ticket size={14} className="text-[#f84565]" />
            <span className="font-mono font-bold text-white text-sm">
               {booking.bookingCode}
            </span>
         </div>
      ),
   },
   {
      id: "customer",
      label: "Khách hàng",
      render: (booking) => (
         <div>
            <div className="text-white text-sm font-medium flex items-center gap-1.5">
               <User size={14} className="text-[#797b7d]" />
               {booking.customerId
                  ? `${booking.customerName}`
                  : "Khách vãng lai"}
            </div>
            <div className="text-[#797b7d] text-[11px] mt-1 flex items-center gap-1">
               {booking.email}
            </div>
            <div className="text-[#797b7d] text-[11px] mt-1 flex items-center gap-1">
               {booking.phoneNumber}
            </div>
         </div>
      ),
   },
   {
      id: "bookingDate",
      label: "Ngày đặt",
      render: (booking) => (
         <div>
            <div className="text-[#797b7d] text-[11px] flex items-center gap-1.5 mt-1">
               <Calendar size={12} />
               {new Date(booking.bookingDate).toLocaleString("vi-VN")}
            </div>
         </div>
      ),
   },
   {
      id: "amount",
      label: "Tổng tiền",
      render: (booking) => (
         <div className="flex flex-col">
            <div className="text-[#f84565] font-bold text-sm">
               {booking.finalAmount?.toLocaleString("vi-VN")}đ
            </div>
            {booking.paymentMethod && (
               <div className="text-[10px] text-[#797b7d] flex items-center gap-1">
                  <CreditCard size={10} /> {booking.paymentMethod}
               </div>
            )}
         </div>
      ),
   },
   {
      id: "status",
      label: "Trạng thái",
      render: (booking) => {
         const status = booking.status;
         const styles: Record<string, string> = {
            PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            CANCELLED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            EXPIRED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
         };
         return (
            <span
               className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border uppercase tracking-wider ${styles[status] || styles.PENDING}`}
            >
               {status}
            </span>
         );
      },
   },
   {
      id: "actions",
      label: "Thao tác",
      align: "right",
      render: (booking) => (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#797b7d] hover:text-[#f84565]"
               >
                  <EllipsisVertical size={18} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align="end"
               className="w-40 bg-[#1a1a1e] border-white/10 text-gray-300"
            >
               <DropdownMenuItem
                  onClick={() => handlers.onView(booking)}
                  className="cursor-pointer hover:bg-white/5"
               >
                  <Eye size={14} className="mr-2 text-blue-400" />
                  <span>Xem chi tiết</span>
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => handlers.onDelete(booking.id)}
                  className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
               >
                  <Trash2 size={14} className="mr-2" />
                  <span>Xóa đơn hàng</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

export const getBookingFilters = (): FilterField[] => [
   {
      name: "keyword",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Mã vé, tên khách...",
   },
   {
      name: "status",
      label: "Trạng thái",
      type: "select",
      options: [
         { value: "CONFIRMED", label: "Đã xác nhận" },
         { value: "CANCELLED", label: "Đã hủy" },
         { value: "PENDING", label: "Chờ thanh toán" },
      ],
   },
];
