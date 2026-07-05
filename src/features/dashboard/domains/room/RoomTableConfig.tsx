import React from "react";
import {
   Layers,
   Clock,
   Building2,
   Calendar,
   Edit2,
   Trash2,
   EllipsisVertical,
   Users,
   Eye,
} from "lucide-react";
import type { Room } from "@/types/room";
import type { Column } from "@/features/dashboard/shared/DashboardEntityList";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const formatTime = (time?: string) => {
   if (!time) return "—";
   // Backend trả về "HH:mm:ss", chỉ lấy "HH:mm"
   return time.substring(0, 5);
};

export const getRoomColumns = (handlers: {
   onEdit: (room: Room) => void;
   onDelete: (id: string) => void;
   onViewDetail: (room: Room) => void;
   permissions: { canDelete: boolean; canUpdate: boolean };
}): Column<Room>[] => [
   {
      id: "name",
      label: "Phòng chiếu",
      render: (room) => (
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
               <Layers size={14} className="text-rose-400" />
            </div>
            <div>
               <div className="text-white text-sm font-semibold">{room.name}</div>
               <div className="text-[#797b7d] text-[11px]">ID: {room.id.substring(0, 8)}...</div>
            </div>
         </div>
      ),
   },
   {
      id: "branchId",
      label: "Chi nhánh",
      render: (room) => (
         <div className="flex items-center gap-1.5 text-[#d1d5dc] text-xs">
            <Building2 size={12} className="text-rose-500" />
            <span className="font-medium bg-white/5 px-2 py-1 rounded">
               {(room as any).branchName || room.branchId?.substring(0, 8) + "..."}
            </span>
         </div>
      ),
   },
   {
      id: "totalSeats",
      label: "Số ghế",
      align: "center",
      render: (room) => (
         <div className="flex items-center justify-center gap-1.5 text-[#d1d5dc]">
            <Users size={12} className="text-rose-400" />
            <span className="text-sm font-bold text-white">{room.totalSeats}</span>
            <span className="text-[#797b7d] text-xs">ghế</span>
         </div>
      ),
   },
   {
      id: "openTime",
      label: "Giờ hoạt động",
      render: (room) => (
         <div className="flex items-center gap-1.5 text-[#d1d5dc] text-xs">
            <Clock size={12} className="text-emerald-400" />
            {room.openTime && room.closeTime ? (
               <span>
                  {formatTime(room.openTime)}{" "}
                  <span className="text-[#797b7d]">–</span>{" "}
                  {formatTime(room.closeTime)}
               </span>
            ) : (
               <span className="text-[#797b7d]">Chưa thiết lập</span>
            )}
         </div>
      ),
   },
   {
      id: "createTime",
      label: "Ngày tạo",
      render: (room) => (
         <div className="text-[#797b7d] text-xs flex items-center gap-1.5">
            <Calendar size={12} />
            {room.createTime
               ? new Date(room.createTime).toLocaleDateString("vi-VN")
               : "—"}
         </div>
      ),
   },
   {
      id: "actions",
      label: "Hành động",
      align: "right",
      render: (room) => (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#797b7d]"
               >
                  <EllipsisVertical size={18} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align="end"
               className="bg-[#1a1a1e] border-white/10 text-gray-300"
            >
               <DropdownMenuItem
                  onClick={() => handlers.onViewDetail(room)}
                  className="cursor-pointer"
               >
                  <Eye size={14} className="mr-2 text-emerald-400" /> Xem chi tiết
               </DropdownMenuItem>
               {handlers.permissions.canUpdate && (
                  <DropdownMenuItem
                     onClick={() => handlers.onEdit(room)}
                     className="cursor-pointer"
                  >
                     <Edit2 size={14} className="mr-2 text-blue-400" /> Chỉnh sửa
                  </DropdownMenuItem>
               )}
               {handlers.permissions.canDelete && (
                  <DropdownMenuItem
                     onClick={() => handlers.onDelete(room.id)}
                     className="text-red-400 cursor-pointer"
                  >
                     <Trash2 size={14} className="mr-2" /> Xóa
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];
